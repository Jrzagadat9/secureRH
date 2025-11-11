from rest_framework import serializers
from .models import Audit, Finding
from apps.tenants.serializers import TenantSerializer
from apps.accounts.serializers import UserSerializer


class FindingSerializer(serializers.ModelSerializer):
    """Serializer pour les findings"""
    class Meta:
        model = Finding
        fields = [
            'id', 'severity', 'title', 'description', 'recommendation',
            'cwe', 'cvss', 'category', 'priority_score', 'ai_analyzed',
            'location', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class FindingDetailSerializer(FindingSerializer):
    """Serializer détaillé pour les findings"""
    pass


class AuditSerializer(serializers.ModelSerializer):
    """Serializer pour les audits"""
    tenant = TenantSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)
    findings_count = serializers.IntegerField(source='total_findings', read_only=True)

    class Meta:
        model = Audit
        fields = [
            'id', 'name', 'type', 'status', 'target', 'description',
            'score', 'total_findings', 'critical_count', 'high_count',
            'medium_count', 'low_count', 'info_count',
            'started_at', 'completed_at', 'created_at', 'updated_at',
            'tenant', 'created_by', 'error_message', 'findings_count'
        ]
        read_only_fields = [
            'id', 'score', 'total_findings', 'critical_count', 'high_count',
            'medium_count', 'low_count', 'info_count',
            'started_at', 'completed_at', 'created_at', 'updated_at',
            'error_message'
        ]


class AuditDetailSerializer(AuditSerializer):
    """Serializer détaillé pour les audits avec findings"""
    findings = FindingSerializer(many=True, read_only=True)

    class Meta(AuditSerializer.Meta):
        fields = AuditSerializer.Meta.fields + ['findings']


class CreateAuditSerializer(serializers.ModelSerializer):
    """Serializer pour créer un audit"""
    class Meta:
        model = Audit
        fields = ['name', 'type', 'target', 'description']

    def create(self, validated_data):
        # Le tenant et created_by sont ajoutés dans la vue
        return Audit.objects.create(**validated_data)


class TriggerScanSerializer(serializers.Serializer):
    """Serializer pour déclencher un scan"""
    target = serializers.CharField(required=True, help_text="URL, IP ou domaine à scanner")
    scan_type = serializers.ChoiceField(
        choices=['quick', 'full', 'custom'],
        default='quick',
        help_text="Type de scan"
    )

