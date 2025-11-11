from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Avg
from .models import Audit, Finding
from .serializers import (
    AuditSerializer,
    AuditDetailSerializer,
    CreateAuditSerializer,
    FindingSerializer,
    TriggerScanSerializer,
)
from .tasks import run_audit_scan


class AuditViewSet(viewsets.ModelViewSet):
    """ViewSet pour les audits"""
    serializer_class = AuditSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type', 'status']
    search_fields = ['name', 'target', 'description']
    ordering_fields = ['created_at', 'score', 'total_findings']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filtrer par tenant de l'utilisateur"""
        user = self.request.user
        if hasattr(user, 'tenant') and user.tenant:
            return Audit.objects.filter(tenant=user.tenant)
        return Audit.objects.none()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return AuditDetailSerializer
        if self.action == 'create':
            return CreateAuditSerializer
        return AuditSerializer

    def create(self, request, *args, **kwargs):
        """Créer un audit avec le tenant de l'utilisateur"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        tenant = user.tenant if hasattr(user, 'tenant') and user.tenant else None
        
        if not tenant:
            # Créer un tenant par défaut si l'utilisateur n'en a pas
            from apps.tenants.models import Tenant
            tenant, _ = Tenant.objects.get_or_create(
                name=f"Tenant {user.email}",
                defaults={'subdomain': user.email.split('@')[0]}
            )
            user.tenant = tenant
            user.save()
        
        audit = serializer.save(tenant=tenant, created_by=user)
        
        # Retourner avec le serializer complet
        output_serializer = AuditSerializer(audit)
        headers = self.get_success_headers(output_serializer.data)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=['post'])
    def trigger_scan(self, request, pk=None):
        """Déclencher un scan pour un audit"""
        audit = self.get_object()
        
        if audit.status == 'running':
            return Response(
                {'error': 'Un scan est déjà en cours pour cet audit'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = TriggerScanSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Mettre à jour la cible si fournie
        target = serializer.validated_data.get('target')
        if target:
            audit.target = target
            audit.status = 'pending'
            audit.save()
        
        # Déclencher le scan (asynchrone avec Celery ou synchrone pour les tests)
        try:
            # Essayer d'utiliser Celery si disponible
            try:
                run_audit_scan.delay(str(audit.id))
                return Response({
                    'message': 'Scan déclenché avec succès',
                    'audit_id': str(audit.id),
                    'status': 'running'
                }, status=status.HTTP_202_ACCEPTED)
            except Exception as celery_error:
                # Si Celery n'est pas disponible, exécuter de manière synchrone
                # (utile pour les tests sans Redis)
                run_audit_scan(str(audit.id))
                return Response({
                    'message': 'Scan terminé avec succès',
                    'audit_id': str(audit.id),
                    'status': 'completed'
                }, status=status.HTTP_200_OK)
        except Exception as e:
            audit.status = 'failed'
            audit.error_message = str(e)
            audit.save()
            return Response(
                {'error': f'Erreur lors du déclenchement du scan: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'])
    def findings(self, request, pk=None):
        """Récupérer les findings d'un audit"""
        audit = self.get_object()
        findings = audit.findings.all()
        serializer = FindingSerializer(findings, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Statistiques globales des audits"""
        queryset = self.get_queryset()
        
        stats = {
            'total_audits': queryset.count(),
            'completed_audits': queryset.filter(status='completed').count(),
            'running_audits': queryset.filter(status='running').count(),
            'pending_audits': queryset.filter(status='pending').count(),
            'failed_audits': queryset.filter(status='failed').count(),
            'total_findings': sum(audit.total_findings for audit in queryset),
            'critical_findings': sum(audit.critical_count for audit in queryset),
            'high_findings': sum(audit.high_count for audit in queryset),
            'average_score': queryset.filter(score__isnull=False).aggregate(
                avg_score=Avg('score')
            )['avg_score'] or 0,
        }
        
        return Response(stats)


class FindingViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet en lecture seule pour les findings"""
    serializer_class = FindingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['severity', 'category', 'ai_analyzed']
    search_fields = ['title', 'description', 'cwe']
    ordering_fields = ['priority_score', 'cvss', 'severity', 'created_at']
    ordering = ['-priority_score', '-cvss', 'severity']

    def get_queryset(self):
        """Filtrer par tenant de l'utilisateur"""
        user = self.request.user
        if hasattr(user, 'tenant') and user.tenant:
            return Finding.objects.filter(audit__tenant=user.tenant)
        return Finding.objects.none()

