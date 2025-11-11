from django.db import models
from django.utils import timezone
import uuid


class Tenant(models.Model):
    """Modèle pour les tenants (entreprises)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name="Nom de l'entreprise")
    subdomain = models.CharField(max_length=100, unique=True, verbose_name="Sous-domaine")
    plan = models.CharField(
        max_length=50,
        choices=[
            ('free', 'Gratuit'),
            ('starter', 'Starter'),
            ('professional', 'Professional'),
            ('enterprise', 'Enterprise'),
        ],
        default='free',
        verbose_name="Plan d'abonnement"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Tenant"
        verbose_name_plural = "Tenants"
        ordering = ['-created_at']

    def __str__(self):
        return self.name

