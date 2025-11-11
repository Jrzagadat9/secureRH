from django.db import connection


class TenantMiddleware:
    """Middleware pour gérer le multi-tenant avec Row-Level Security"""
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Extraire le tenant_id depuis le JWT ou le subdomain
        tenant_id = self.get_tenant_id(request)
        
        if tenant_id:
            # Configurer PostgreSQL pour Row-Level Security
            with connection.cursor() as cursor:
                cursor.execute(
                    "SET app.current_tenant_id = %s",
                    [str(tenant_id)]
                )
        
        response = self.get_response(request)
        return response

    def get_tenant_id(self, request):
        """Extraire le tenant_id depuis la requête"""
        # Option 1: Depuis le JWT (si l'utilisateur est authentifié)
        if hasattr(request, 'user') and request.user.is_authenticated:
            if hasattr(request.user, 'tenant') and request.user.tenant:
                return str(request.user.tenant.id)
        
        # Option 2: Depuis le subdomain
        host = request.get_host()
        subdomain = host.split('.')[0] if '.' in host else None
        
        if subdomain and subdomain != 'www' and subdomain != 'localhost':
            from .models import Tenant
            try:
                tenant = Tenant.objects.get(subdomain=subdomain)
                return str(tenant.id)
            except Tenant.DoesNotExist:
                pass
        
        return None

