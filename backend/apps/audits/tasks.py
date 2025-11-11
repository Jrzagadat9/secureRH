"""
Tâches Celery pour les audits asynchrones
"""
from celery import shared_task
from django.utils import timezone
from .models import Audit, Finding
import time
import random


@shared_task
def run_audit_scan(audit_id):
    """
    Tâche asynchrone pour exécuter un scan de sécurité
    
    Pour le MVP, on simule un scan. Plus tard, on intégrera
    OWASP ZAP, Nmap, ou d'autres scanners.
    """
    try:
        audit = Audit.objects.get(id=audit_id)
        audit.status = 'running'
        audit.started_at = timezone.now()
        audit.save()
        
        # Simulation d'un scan (à remplacer par un vrai scanner)
        # Pour le MVP, on génère des findings de test
        time.sleep(2)  # Simuler le temps de scan
        
        # Générer des findings de test
        findings_data = [
            {
                'severity': 'critical',
                'title': 'Vulnérabilité critique détectée',
                'description': 'Une vulnérabilité critique a été détectée dans le système.',
                'recommendation': 'Corriger immédiatement cette vulnérabilité.',
                'cwe': 'CWE-79',
                'cvss': 9.8,
                'category': 'Injection',
            },
            {
                'severity': 'high',
                'title': 'Problème de sécurité élevé',
                'description': 'Un problème de sécurité de niveau élevé a été identifié.',
                'recommendation': 'Traiter ce problème en priorité.',
                'cwe': 'CWE-89',
                'cvss': 7.5,
                'category': 'SQL Injection',
            },
            {
                'severity': 'medium',
                'title': 'Vulnérabilité moyenne',
                'description': 'Une vulnérabilité de niveau moyen a été détectée.',
                'recommendation': 'Planifier une correction.',
                'cwe': 'CWE-352',
                'cvss': 5.3,
                'category': 'CSRF',
            },
            {
                'severity': 'low',
                'title': 'Problème mineur',
                'description': 'Un problème mineur a été identifié.',
                'recommendation': 'Corriger lors de la prochaine maintenance.',
                'cwe': 'CWE-200',
                'cvss': 2.5,
                'category': 'Information Disclosure',
            },
        ]
        
        # Créer les findings
        for finding_data in findings_data:
            Finding.objects.create(
                audit=audit,
                **finding_data
            )
        
        # Mettre à jour les compteurs
        audit.update_counts()
        
        # Calculer le score (100 - (critical*10 + high*5 + medium*2 + low*1))
        score = 100
        score -= audit.critical_count * 10
        score -= audit.high_count * 5
        score -= audit.medium_count * 2
        score -= audit.low_count * 1
        audit.score = max(0, min(100, score))
        
        # Finaliser l'audit
        audit.status = 'completed'
        audit.completed_at = timezone.now()
        audit.save()
        
        return f"Scan terminé pour l'audit {audit_id}. {audit.total_findings} findings détectés."
        
    except Audit.DoesNotExist:
        return f"Audit {audit_id} non trouvé"
    except Exception as e:
        # Marquer l'audit comme échoué
        try:
            audit = Audit.objects.get(id=audit_id)
            audit.status = 'failed'
            audit.error_message = str(e)
            audit.completed_at = timezone.now()
            audit.save()
        except:
            pass
        raise

