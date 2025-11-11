# Guide d'Installation - SecureRH

## 🚀 Installation Complète

### Prérequis

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+ (ou Docker)
- Docker & Docker Compose (recommandé)

---

## 📦 Backend Django

### 1. Créer un environnement virtuel

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
```

### 2. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 3. Configurer les variables d'environnement

Créez un fichier `.env` dans le dossier `backend/` :

```bash
cp .env.example .env
# Éditez .env avec vos configurations
```

Variables importantes :
- `SECRET_KEY` : Clé secrète Django
- `DB_NAME`, `DB_USER`, `DB_PASSWORD` : Configuration PostgreSQL
- `DEBUG` : `True` pour le développement

### 4. Démarrer PostgreSQL (avec Docker)

```bash
# Depuis la racine du projet
docker-compose up -d postgres redis
```

### 5. Créer les migrations et appliquer

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Créer un superutilisateur

```bash
python manage.py createsuperuser
```

### 7. Démarrer le serveur Django

```bash
python manage.py runserver
```

Le serveur sera accessible sur `http://localhost:8000`

### 8. Accéder à la documentation API

- Swagger UI : `http://localhost:8000/api/docs/`
- Admin Django : `http://localhost:8000/admin/`

---

## 🎨 Frontend React

### 1. Installer les dépendances

```bash
cd frontend
npm install
```

### 2. Configurer les variables d'environnement

Créez un fichier `.env.local` dans le dossier `frontend/` :

```bash
VITE_API_URL=http://localhost:8000/api
```

### 3. Démarrer le serveur de développement

```bash
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

---

## ✅ Vérification

### Tester l'API

```bash
# Test de santé
curl http://localhost:8000/api/auth/login/

# Inscription
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test1234!",
    "password_confirm": "Test1234!"
  }'
```

### Tester le Frontend

1. Ouvrez `http://localhost:5173`
2. Cliquez sur "S'inscrire"
3. Créez un compte
4. Vous serez redirigé vers le dashboard

---

## 🔧 Problèmes Courants

### Erreur : "ModuleNotFoundError: No module named 'django'"

**Solution** : Activez l'environnement virtuel :
```bash
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

### Erreur : "Could not connect to database"

**Solution** : Vérifiez que PostgreSQL est démarré :
```bash
docker-compose ps
docker-compose up -d postgres
```

### Erreur CORS dans le navigateur

**Solution** : Vérifiez que `CORS_ALLOWED_ORIGINS` dans `settings.py` inclut votre URL frontend.

### Erreur : "Port already in use"

**Solution** : Changez le port dans `vite.config.js` ou arrêtez le processus qui utilise le port.

---

## 📝 Prochaines Étapes

1. ✅ Authentification fonctionnelle
2. ⏭️ Créer le module d'audit
3. ⏭️ Intégrer OpenAI
4. ⏭️ Créer les dashboards

---

*Dernière mise à jour : [Date]*

