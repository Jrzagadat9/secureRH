# Guide de Test - Authentification SecureRH

## 🧪 Tests à Effectuer

### Prérequis

1. **Backend Django** :
   - Python 3.11+ installé
   - Environnement virtuel activé
   - Dépendances installées
   - Base de données configurée (PostgreSQL ou SQLite pour test)

2. **Frontend React** :
   - Node.js 18+ installé
   - Dépendances npm installées

---

## 📋 Checklist de Vérification

### 1. Vérifier l'Installation Backend

```bash
cd backend

# Vérifier Python
python3 --version  # Doit être 3.11+

# Vérifier l'environnement virtuel
source venv/bin/activate  # ou venv\Scripts\activate sur Windows

# Vérifier Django
python manage.py --version

# Vérifier les dépendances
pip list | grep -i django
pip list | grep -i djangorestframework
```

### 2. Configurer la Base de Données

**Option A : SQLite (pour test rapide)**

Modifiez temporairement `backend/backend/settings.py` :

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

**Option B : PostgreSQL (recommandé)**

Assurez-vous que PostgreSQL est démarré et créez la base :

```sql
CREATE DATABASE securerh;
CREATE USER securerh WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE securerh TO securerh;
```

### 3. Créer les Migrations

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### 4. Créer un Superutilisateur (optionnel)

```bash
python manage.py createsuperuser
```

### 5. Démarrer le Serveur Django

```bash
python manage.py runserver
```

Le serveur devrait être accessible sur `http://localhost:8000`

---

## 🧪 Tests API avec curl

### Test 1 : Vérifier que l'API répond

```bash
curl http://localhost:8000/api/docs/
```

### Test 2 : Inscription (Register)

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test1234!",
    "password_confirm": "Test1234!",
    "first_name": "Test",
    "last_name": "User"
  }'
```

**Réponse attendue** :
```json
{
  "user": {
    "id": "...",
    "email": "test@example.com",
    "username": "testuser",
    ...
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Test 3 : Connexion (Login)

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!"
  }'
```

**Réponse attendue** : Même format que l'inscription

### Test 4 : Récupérer les infos utilisateur (Me)

```bash
# Remplacez YOUR_ACCESS_TOKEN par le token reçu lors du login
curl -X GET http://localhost:8000/api/auth/me/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Réponse attendue** :
```json
{
  "id": "...",
  "email": "test@example.com",
  "username": "testuser",
  ...
}
```

### Test 5 : Rafraîchir le token (Refresh)

```bash
curl -X POST http://localhost:8000/api/auth/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "YOUR_REFRESH_TOKEN"
  }'
```

---

## 🌐 Tests Frontend

### 1. Installer les Dépendances

```bash
cd frontend
npm install
```

### 2. Démarrer le Serveur de Développement

```bash
npm run dev
```

Le frontend devrait être accessible sur `http://localhost:5173`

### 3. Tests Manuels

1. **Page d'Inscription** :
   - Ouvrir `http://localhost:5173/register`
   - Remplir le formulaire
   - Cliquer sur "S'inscrire"
   - Vérifier la redirection vers `/dashboard`

2. **Page de Connexion** :
   - Ouvrir `http://localhost:5173/login`
   - Entrer email et mot de passe
   - Cliquer sur "Se connecter"
   - Vérifier la redirection vers `/dashboard`

3. **Dashboard** :
   - Vérifier que les informations utilisateur s'affichent
   - Tester le bouton "Déconnexion"

4. **Protection des Routes** :
   - Se déconnecter
   - Essayer d'accéder directement à `/dashboard`
   - Vérifier la redirection vers `/login`

---

## 🐛 Dépannage

### Erreur : "ModuleNotFoundError: No module named 'django'"

**Solution** :
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### Erreur : "django.db.utils.OperationalError: could not connect to server"

**Solution** :
- Vérifiez que PostgreSQL est démarré
- Vérifiez les credentials dans `.env`
- Ou utilisez SQLite temporairement

### Erreur CORS dans le navigateur

**Solution** :
- Vérifiez que `CORS_ALLOWED_ORIGINS` dans `settings.py` inclut `http://localhost:5173`
- Redémarrez le serveur Django

### Erreur : "CSRF verification failed"

**Solution** :
- C'est normal pour les API REST
- Vérifiez que vous utilisez `Content-Type: application/json`
- Les tokens JWT doivent être dans le header `Authorization: Bearer TOKEN`

### Erreur : "Invalid token"

**Solution** :
- Vérifiez que le token n'a pas expiré
- Utilisez le refresh token pour obtenir un nouveau access token

---

## ✅ Checklist de Validation

- [ ] Le serveur Django démarre sans erreur
- [ ] L'API `/api/docs/` est accessible
- [ ] L'inscription fonctionne (curl)
- [ ] La connexion fonctionne (curl)
- [ ] Le endpoint `/api/auth/me/` fonctionne avec un token valide
- [ ] Le frontend démarre sans erreur
- [ ] La page d'inscription fonctionne
- [ ] La page de connexion fonctionne
- [ ] Le dashboard s'affiche après connexion
- [ ] La déconnexion fonctionne
- [ ] Les routes sont protégées

---

*Dernière mise à jour : [Date]*

