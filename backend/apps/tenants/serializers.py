from rest_framework import serializers
from .models import Tenant


class TenantSerializer(serializers.ModelSerializer):
    """Serializer pour les tenants"""
    class Meta:
        model = Tenant
        fields = ['id', 'name', 'subdomain', 'plan', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

