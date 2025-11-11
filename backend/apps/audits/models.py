from django.db import models
from django.utils import timezone
import uuid
from apps.tenants.models import Tenant
from apps.accounts.models import User


class Audit(models.Model):
    """Modèle pour les audits de sécurité"""
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('running', 'En cours'),
        ('completed', 'Terminé'),
        ('failed', 'Échoué'),
        ('cancelled', 'Annulé'),
    ]

    TYPE_CHOICES = [
        ('technical', 'Technique'),
        ('organizational', 'Organisationnel'),
        ('rgpd', 'RGPD'),
        ('compliance', 'Conformité'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='audits',
        verbose_name="Tenant"
    )
    name = models.CharField(max_length=255, verbose_name="Nom de l'audit")
    type = models.CharField(
        max_length=50,
        choices=TYPE_CHOICES,
        default='technical',
        verbose_name="Type d'audit"
    )
    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name="Statut"
    )
    target = models.CharField(
        max_length=500,
        null=True,
        blank=True,
        verbose_name="Cible",
        help_text="URL, IP, domaine ou autre cible à auditer"
    )
    description = models.TextField(null=True, blank=True, verbose_name="Description")
    
    # Scores et métriques
    score = models.IntegerField(
        null=True,
        blank=True,
        verbose_name="Score",
        help_text="Score de sécurité (0-100)"
    )
    total_findings = models.IntegerField(default=0, verbose_name="Nombre total de findings")
    critical_count = models.IntegerField(default=0, verbose_name="Critiques")
    high_count = models.IntegerField(default=0, verbose_name="Élevées")
    medium_count = models.IntegerField(default=0, verbose_name="Moyennes")
    low_count = models.IntegerField(default=0, verbose_name="Faibles")
    info_count = models.IntegerField(default=0, verbose_name="Informatives")
    
    # Dates
    started_at = models.DateTimeField(null=True, blank=True, verbose_name="Début")
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name="Fin")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    # Métadonnées
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_audits',
        verbose_name="Créé par"
    )
    error_message = models.TextField(null=True, blank=True, verbose_name="Message d'erreur")

    class Meta:
        verbose_name = "Audit"
        verbose_name_plural = "Audits"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['tenant', 'status']),
            models.Index(fields=['tenant', 'type']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"

    def update_counts(self):
        """Met à jour les compteurs de findings"""
        self.critical_count = self.findings.filter(severity='critical').count()
        self.high_count = self.findings.filter(severity='high').count()
        self.medium_count = self.findings.filter(severity='medium').count()
        self.low_count = self.findings.filter(severity='low').count()
        self.info_count = self.findings.filter(severity='info').count()
        self.total_findings = self.findings.count()
        self.save(update_fields=[
            'critical_count', 'high_count', 'medium_count',
            'low_count', 'info_count', 'total_findings'
        ])


class Finding(models.Model):
    """Modèle pour les vulnérabilités/findings détectés"""
    SEVERITY_CHOICES = [
        ('critical', 'Critique'),
        ('high', 'Élevée'),
        ('medium', 'Moyenne'),
        ('low', 'Faible'),
        ('info', 'Informatif'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    audit = models.ForeignKey(
        Audit,
        on_delete=models.CASCADE,
        related_name='findings',
        verbose_name="Audit"
    )
    severity = models.CharField(
        max_length=20,
        choices=SEVERITY_CHOICES,
        verbose_name="Sévérité"
    )
    title = models.CharField(max_length=500, verbose_name="Titre")
    description = models.TextField(verbose_name="Description")
    recommendation = models.TextField(null=True, blank=True, verbose_name="Recommandation")
    
    # Métadonnées techniques
    cwe = models.CharField(
        max_length=20,
        null=True,
        blank=True,
        verbose_name="CWE",
        help_text="Common Weakness Enumeration"
    )
    cvss = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        null=True,
        blank=True,
        verbose_name="CVSS Score",
        help_text="Score CVSS (0.0-10.0)"
    )
    category = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        verbose_name="Catégorie"
    )
    
    # Priorisation IA
    priority_score = models.IntegerField(
        null=True,
        blank=True,
        verbose_name="Score de priorité",
        help_text="Score calculé par l'IA (0-100)"
    )
    ai_analyzed = models.BooleanField(default=False, verbose_name="Analysé par IA")
    
    # Localisation
    location = models.CharField(
        max_length=500,
        null=True,
        blank=True,
        verbose_name="Localisation",
        help_text="URL, fichier, ligne, etc."
    )
    
    # Dates
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")

    class Meta:
        verbose_name = "Finding"
        verbose_name_plural = "Findings"
        ordering = ['-priority_score', '-cvss', 'severity', 'created_at']
        indexes = [
            models.Index(fields=['audit', 'severity']),
            models.Index(fields=['priority_score']),
        ]

    def __str__(self):
        return f"{self.title} ({self.get_severity_display()})"

