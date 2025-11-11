from django.urls import path
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Tenant
from .serializers import TenantSerializer


class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer

    @action(detail=False, methods=['get'])
    def current(self, request):
        """Récupérer le tenant actuel de l'utilisateur"""
        if request.user.is_authenticated and hasattr(request.user, 'tenant'):
            serializer = self.get_serializer(request.user.tenant)
            return Response(serializer.data)
        return Response({'detail': 'Aucun tenant associé'}, status=404)


# URLs simples pour l'instant
urlpatterns = [
    # Les ViewSets seront ajoutés plus tard avec un router
]

