from django.contrib import admin
from .models import Audit, Finding


@admin.register(Audit)
class AuditAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'status', 'score', 'tenant', 'created_at']
    list_filter = ['type', 'status', 'created_at']
    search_fields = ['name', 'target', 'description']
    readonly_fields = ['id', 'created_at', 'updated_at']
    fieldsets = (
        ('Informations générales', {
            'fields': ('id', 'tenant', 'name', 'type', 'status', 'target', 'description')
        }),
        ('Métriques', {
            'fields': (
                'score', 'total_findings',
                'critical_count', 'high_count', 'medium_count', 'low_count', 'info_count'
            )
        }),
        ('Dates', {
            'fields': ('started_at', 'completed_at', 'created_at', 'updated_at')
        }),
        ('Autres', {
            'fields': ('created_by', 'error_message')
        }),
    )


@admin.register(Finding)
class FindingAdmin(admin.ModelAdmin):
    list_display = ['title', 'severity', 'cvss', 'priority_score', 'audit', 'created_at']
    list_filter = ['severity', 'category', 'ai_analyzed', 'created_at']
    search_fields = ['title', 'description', 'cwe']
    readonly_fields = ['id', 'created_at']

