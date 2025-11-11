from django.contrib import admin
from .models import Tenant


@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ['name', 'subdomain', 'plan', 'created_at']
    list_filter = ['plan', 'created_at']
    search_fields = ['name', 'subdomain']

