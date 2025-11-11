from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import uuid
from apps.tenants.models import Tenant


class User(AbstractUser):
    """Modèle utilisateur personnalisé avec support multi-tenant"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='users',
        null=True,
        blank=True,
        verbose_name="Tenant"
    )
    email = models.EmailField(unique=True, verbose_name="Email")
    mfa_enabled = models.BooleanField(default=False, verbose_name="MFA activé")
    mfa_secret = models.CharField(max_length=255, null=True, blank=True, verbose_name="Secret MFA")
    
    # Rôles
    ROLE_CHOICES = [
        ('admin', 'Administrateur'),
        ('user', 'Utilisateur'),
        ('viewer', 'Lecteur'),
    ]
    role = models.CharField(
        max_length=50,
        choices=ROLE_CHOICES,
        default='user',
        verbose_name="Rôle"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"
        ordering = ['-created_at']
        unique_together = [['tenant', 'email']]

    def __str__(self):
        return self.email

