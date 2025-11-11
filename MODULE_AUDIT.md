# Module Audit - SecureRH

## ✅ Ce qui a été créé

### Backend Django

1. **Modèles** :
   - `Audit` : Modèle principal pour les audits de sécurité
   - `Finding` : Modèle pour les vulnérabilités détectées

2. **API REST** :
   - `GET /api/audits/` : Liste des audits
   - `POST /api/audits/` : Créer un audit
   - `GET /api/audits/{id}/` : Détails d'un audit (avec findings)
   - `POST /api/audits/{id}/trigger_scan/` : Déclencher un scan
   - `GET /api/audits/{id}/findings/` : Liste des findings d'un audit
   - `GET /api/audits/stats/` : Statistiques globales
   - `GET /api/findings/` : Liste des findings (filtrable)

3. **Tâches Celery** :
   - `run_audit_scan` : Tâche asynchrone pour exécuter les scans
   - Pour le MVP : simulation de scan avec findings de test
   - Plus tard : intégration avec OWASP ZAP, Nmap, etc.

4. **Configuration** :
   - Celery configuré pour les tâches asynchrones
   - django-filter pour le filtrage des résultats
   - Indexes sur les champs fréquemment utilisés

---

## 🧪 Tests API

### Créer un audit

```bash
curl -X POST http://localhost:8000/api/audits/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Audit de sécurité site web",
    "type": "technical",
    "target": "https://example.com",
    "description": "Audit de sécurité complet"
  }'
```

### Déclencher un scan

```bash
curl -X POST http://localhost:8000/api/audits/{audit_id}/trigger_scan/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "target": "https://example.com",
    "scan_type": "full"
  }'
```

### Récupérer les findings

```bash
curl -X GET http://localhost:8000/api/audits/{audit_id}/findings/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Statistiques

```bash
curl -X GET http://localhost:8000/api/audits/stats/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📋 Prochaines Étapes

1. ✅ Backend API créé
2. ⏭️ Frontend React (pages audits)
3. ⏭️ Dashboard avec métriques
4. ⏭️ Intégration scanner réel (OWASP ZAP)
5. ⏭️ Intégration IA pour priorisation

---

*Module créé le : 2025-11-11*

