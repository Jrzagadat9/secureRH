# Guide de Test Complet - Module Audit

## 🧪 Tests à Effectuer

### 1. Test Backend API

#### A. Créer un Audit
```bash
# Obtenir un token
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Test1234!"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['access'])")

# Créer un audit
curl -X POST http://localhost:8000/api/audits/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mon Premier Audit",
    "type": "technical",
    "target": "https://example.com",
    "description": "Test d audit de sécurité"
  }'
```

#### B. Lister les Audits
```bash
curl -X GET http://localhost:8000/api/audits/ \
  -H "Authorization: Bearer $TOKEN"
```

#### C. Déclencher un Scan
```bash
# Remplacer {audit_id} par l'ID de votre audit
curl -X POST http://localhost:8000/api/audits/{audit_id}/trigger_scan/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "target": "https://example.com",
    "scan_type": "full"
  }'
```

**Note** : Pour que le scan se termine, il faut démarrer Celery :
```bash
cd backend
source venv/bin/activate
celery -A backend worker -l info
```

#### D. Voir les Détails d'un Audit
```bash
curl -X GET http://localhost:8000/api/audits/{audit_id}/ \
  -H "Authorization: Bearer $TOKEN"
```

#### E. Statistiques
```bash
curl -X GET http://localhost:8000/api/audits/stats/ \
  -H "Authorization: Bearer $TOKEN"
```

---

### 2. Test Frontend

#### A. Dashboard
1. Ouvrir `http://localhost:5173/dashboard`
2. Vérifier :
   - Métriques (Total audits, Terminés, Critiques, Score moyen)
   - Liste des audits récents
   - Boutons d'action rapide

#### B. Créer un Audit
1. Cliquer sur "Nouvel Audit" ou aller sur `/audits/new`
2. Remplir :
   - Nom : "Audit Frontend Test"
   - Type : Technique
   - Cible : "https://example.com"
   - Description : "Test depuis le frontend"
3. Cliquer sur "Créer l'audit"
4. Vérifier la redirection vers la page de détail

#### C. Déclencher un Scan
1. Sur la page de détail d'un audit
2. Cliquer sur "Déclencher un scan"
3. Attendre quelques secondes
4. Rafraîchir la page
5. Vérifier que :
   - Le statut passe à "completed"
   - Les findings apparaissent
   - Le score est calculé

#### D. Voir les Findings
1. Sur la page de détail
2. Vérifier l'affichage des findings :
   - Par sévérité (critical, high, medium, low)
   - Avec codes couleur
   - Avec CWE, CVSS si disponibles

---

## ⚠️ Important : Démarrer Celery

Pour que les scans se terminent, **il faut démarrer le worker Celery** :

```bash
# Terminal 3
cd backend
source venv/bin/activate
celery -A backend worker -l info
```

Sans Celery, les scans resteront en statut "pending" ou "running".

---

## ✅ Checklist de Test

### Backend
- [x] Serveur Django démarré
- [x] API authentification fonctionne
- [x] Création d'audit fonctionne
- [x] Déclenchement de scan fonctionne
- [ ] Celery worker démarré (nécessaire pour terminer les scans)
- [x] Récupération des détails fonctionne
- [x] Statistiques fonctionnent

### Frontend
- [x] Serveur Vite démarré
- [ ] Dashboard accessible
- [ ] Liste des audits accessible
- [ ] Création d'audit fonctionne
- [ ] Déclenchement de scan fonctionne
- [ ] Findings s'affichent

---

## 🎯 Résultats Attendus

Après avoir déclenché un scan et attendu quelques secondes :

1. **Statut de l'audit** : `completed`
2. **Score calculé** : Entre 0 et 100
3. **Findings détectés** : 4 findings de test
   - 1 Critique
   - 1 Élevée
   - 1 Moyenne
   - 1 Faible
4. **Compteurs mis à jour** : critical_count, high_count, etc.

---

*Guide créé le : 2025-11-11*

