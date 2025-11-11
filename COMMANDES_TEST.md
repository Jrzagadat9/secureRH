# Commandes de Test - Authentification

## 🚀 Démarrage Rapide

### Option 1 : Test Automatique (Recommandé)

```bash
# Backend - Configuration automatique
cd backend
./test_auth.sh

# Puis démarrer le serveur
source venv/bin/activate
python manage.py runserver
```

### Option 2 : Configuration Manuelle

```bash
# 1. Backend
cd backend

# Créer l'environnement virtuel
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Créer les migrations
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Démarrer le serveur
python manage.py runserver
```

Dans un autre terminal :

```bash
# 2. Frontend
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

---

## 🧪 Tests API avec curl

### Test d'Inscription

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

### Test de Connexion

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!"
  }'
```

### Test de Récupération des Infos Utilisateur

```bash
# Remplacez YOUR_ACCESS_TOKEN par le token reçu
curl -X GET http://localhost:8000/api/auth/me/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🌐 Tests Frontend

1. Ouvrir `http://localhost:5173`
2. Tester l'inscription
3. Tester la connexion
4. Vérifier le dashboard

---

## 📝 Notes

- Par défaut, SQLite est utilisé pour faciliter les tests
- Pour utiliser PostgreSQL, définissez `USE_SQLITE=False` dans `.env`
- Le serveur Django est sur `http://localhost:8000`
- Le frontend React est sur `http://localhost:5173`
- La documentation API est sur `http://localhost:8000/api/docs/`

