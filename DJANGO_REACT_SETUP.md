# Guide de Configuration Django + React - SecureRH

## 🎯 Vue d'Ensemble

Ce guide détaille la configuration complète pour développer SecureRH avec **Django** (backend) et **React** (frontend).

---

## 📦 Stack Technique

### Backend (Django)
- **Django** : 5.2+
- **Django REST Framework** : API REST
- **django-cors-headers** : CORS pour React
- **djangorestframework-simplejwt** : Authentification JWT
- **Celery** : Tâches asynchrones
- **PostgreSQL** : Base de données (avec django-tenants pour multi-tenant)
- **Redis** : Cache et broker Celery

### Frontend (React)
- **React** : 19+
- **Vite** : Build tool
- **React Router** : Routing
- **Axios** : Client HTTP
- **Zustand** ou **Redux Toolkit** : State management
- **Tailwind CSS** : Styling
- **React Hook Form** : Gestion de formulaires

---

## 🚀 Installation et Configuration

### 1. Backend Django

#### Structure du Projet
```
backend/
├── backend/              # Configuration Django
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── apps/                  # Applications Django
│   ├── accounts/         # Authentification
│   ├── tenants/          # Multi-tenancy
│   ├── audits/           # Module audits
│   ├── compliance/       # Module RGPD
│   ├── ai/               # Service IA
│   └── notifications/    # Notifications
├── requirements.txt
└── manage.py
```

#### Installation des Dépendances

```bash
cd backend

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt
```

#### requirements.txt
```txt
Django==5.2.8
djangorestframework==3.15.2
django-cors-headers==4.5.0
djangorestframework-simplejwt==5.3.1
django-tenants==3.5.0  # Pour multi-tenant
psycopg2-binary==2.9.9  # PostgreSQL
redis==5.0.1
celery==5.3.6
python-dotenv==1.0.1
openai==1.12.0
drf-spectacular==0.27.1  # Documentation API
Pillow==10.3.0
reportlab==4.1.0  # Génération PDF
```

#### Configuration settings.py

```python
# backend/backend/settings.py

import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-change-in-production')
DEBUG = os.getenv('DEBUG', 'False') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'drf_spectacular',
    
    # Local apps
    'apps.accounts',
    'apps.tenants',
    'apps.audits',
    'apps.compliance',
    'apps.ai',
    'apps.notifications',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # CORS avant CommonMiddleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'apps.tenants.middleware.TenantMiddleware',  # Multi-tenant
]

ROOT_URLCONF = 'backend.urls'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'securerh'),
        'USER': os.getenv('DB_USER', 'securerh'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'password'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

# JWT Settings
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=7),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
    'ROTATE_REFRESH_TOKENS': True,
}

# CORS Settings (pour React)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",
]

CORS_ALLOW_CREDENTIALS = True

# API Documentation
SPECTACULAR_SETTINGS = {
    'TITLE': 'SecureRH API',
    'DESCRIPTION': 'API pour la plateforme SecureRH',
    'VERSION': '1.0.0',
}

# Celery Configuration
CELERY_BROKER_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = os.getenv('REDIS_URL', 'redis://localhost:6379/0')

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Internationalization
LANGUAGE_CODE = 'fr-fr'
TIME_ZONE = 'Africa/Abidjan'  # Ajuster selon votre fuseau
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
```

#### URLs principales

```python
# backend/backend/urls.py

from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/tenants/', include('apps.tenants.urls')),
    path('api/audits/', include('apps.audits.urls')),
    path('api/compliance/', include('apps.compliance.urls')),
    path('api/ai/', include('apps.ai.urls')),
]
```

---

### 2. Frontend React

#### Structure du Projet
```
frontend/
├── src/
│   ├── components/       # Composants React
│   │   ├── ui/          # Composants UI de base
│   │   ├── dashboard/   # Composants dashboard
│   │   └── audits/      # Composants audits
│   ├── pages/           # Pages/Views
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   └── Audits.jsx
│   ├── services/        # Services API
│   │   └── api.js       # Client Axios
│   ├── store/           # State management (Zustand)
│   │   └── authStore.js
│   ├── hooks/           # Custom hooks
│   │   └── useAuth.js
│   ├── utils/           # Utilitaires
│   │   └── constants.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
└── vite.config.js
```

#### Installation des Dépendances

```bash
cd frontend
npm install
```

#### package.json (dépendances principales)

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^6.22.0",
    "axios": "^1.6.7",
    "zustand": "^4.5.0",
    "react-hook-form": "^7.50.0",
    "recharts": "^2.10.4",
    "date-fns": "^3.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.1.0",
    "vite": "^7.2.2",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35"
  }
}
```

#### Configuration Vite

```javascript
// frontend/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
```

#### Client API Axios

```javascript
// frontend/src/services/api.js

import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs et refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        const response = await axios.post(`${API_URL}/auth/refresh/`, {
          refresh: refreshToken,
        })

        const { access } = response.data
        localStorage.setItem('access_token', access)
        originalRequest.headers.Authorization = `Bearer ${access}`

        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
```

#### Store Zustand (Authentification)

```javascript
// frontend/src/store/authStore.js

import { create } from 'zustand'
import api from '../services/api'

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,

  login: async (email, password) => {
    set({ loading: true })
    try {
      const response = await api.post('/auth/login/', { email, password })
      const { access, refresh, user } = response.data
      
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      
      set({ user, isAuthenticated: true, loading: false })
      return { success: true }
    } catch (error) {
      set({ loading: false })
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erreur de connexion' 
      }
    }
  },

  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    set({ user: null, isAuthenticated: false })
  },

  checkAuth: async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      set({ isAuthenticated: false, user: null })
      return
    }

    try {
      const response = await api.get('/auth/me/')
      set({ user: response.data, isAuthenticated: true })
    } catch (error) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      set({ user: null, isAuthenticated: false })
    }
  },
}))

export default useAuthStore
```

---

## 🔄 Communication Django ↔ React

### 1. CORS Configuration

Django doit autoriser les requêtes depuis React :

```python
# backend/backend/settings.py

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite
    "http://localhost:3000",
]

CORS_ALLOW_CREDENTIALS = True
```

### 2. Authentification JWT

**Backend (Django)** :
```python
# apps/accounts/views.py

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        # Ajouter les infos utilisateur
        user = request.user
        response.data['user'] = {
            'id': user.id,
            'email': user.email,
            'name': user.get_full_name(),
        }
        return response
```

**Frontend (React)** :
```javascript
// Exemple d'utilisation
import api from '../services/api'

const login = async (email, password) => {
  const response = await api.post('/auth/login/', { email, password })
  const { access, refresh, user } = response.data
  // Stocker les tokens
  localStorage.setItem('access_token', access)
  localStorage.setItem('refresh_token', refresh)
}
```

---

## 🗄️ Multi-Tenancy avec Django

### Option 1 : django-tenants (Recommandé)

```python
# Installation
pip install django-tenants

# settings.py
INSTALLED_APPS = [
    'django_tenants',
    # ...
]

DATABASE_ROUTERS = (
    'django_tenants.routers.TenantSyncRouter',
)

MIDDLEWARE = [
    'django_tenants.middleware.main.TenantMainMiddleware',
    # ...
]
```

### Option 2 : Row-Level Security (PostgreSQL)

```python
# apps/tenants/middleware.py

class TenantMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        tenant_id = self.get_tenant_id(request)  # Depuis JWT ou subdomain
        if tenant_id:
            with connection.cursor() as cursor:
                cursor.execute(f"SET app.current_tenant_id = '{tenant_id}'")
        
        response = self.get_response(request)
        return response
```

---

## 🚀 Démarrage du Projet

### 1. Démarrer les services (Docker)

```bash
docker-compose up -d postgres redis
```

### 2. Backend Django

```bash
cd backend
source venv/bin/activate
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 3. Frontend React

```bash
cd frontend
npm run dev
```

### 4. Celery Worker (pour tâches asynchrones)

```bash
cd backend
celery -A backend worker -l info
```

---

## 📝 Exemple d'Application Django

### Modèle Audit

```python
# apps/audits/models.py

from django.db import models
from apps.tenants.models import Tenant

class Audit(models.Model):
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('running', 'En cours'),
        ('completed', 'Terminé'),
        ('failed', 'Échoué'),
    ]

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=50)  # 'technical', 'organizational', 'rgpd'
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    target = models.CharField(max_length=500)  # URL, IP, domain
    score = models.IntegerField(null=True, blank=True)  # 0-100
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
```

### Vue API

```python
# apps/audits/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Audit
from .serializers import AuditSerializer

class AuditViewSet(viewsets.ModelViewSet):
    serializer_class = AuditSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Audit.objects.filter(tenant=self.request.user.tenant)

    @action(detail=True, methods=['post'])
    def trigger_scan(self, request, pk=None):
        audit = self.get_object()
        # Déclencher le scan de manière asynchrone
        from .tasks import run_audit_scan
        run_audit_scan.delay(audit.id)
        return Response({'status': 'Scan déclenché'})
```

### Serializer

```python
# apps/audits/serializers.py

from rest_framework import serializers
from .models import Audit

class AuditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audit
        fields = ['id', 'name', 'type', 'status', 'target', 'score', 
                  'started_at', 'completed_at', 'created_at']
        read_only_fields = ['status', 'score', 'started_at', 'completed_at']
```

---

## ✅ Checklist de Configuration

- [ ] Backend Django configuré avec DRF
- [ ] CORS configuré pour React
- [ ] Authentification JWT fonctionnelle
- [ ] Frontend React connecté à l'API Django
- [ ] PostgreSQL configuré (au lieu de SQLite)
- [ ] Redis configuré pour Celery
- [ ] Variables d'environnement (.env) configurées
- [ ] Documentation API accessible (Swagger)

---

*Document mis à jour : [Date]*

