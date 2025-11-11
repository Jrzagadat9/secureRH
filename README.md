# SecureRH - Plateforme SaaS Sécurité & Conformité RGPD

> Plateforme complète de détection de vulnérabilités, analyse IA et conformité RGPD pour les entreprises, spécialement conçue pour le secteur RH.

## 📖 Vue d'ensemble

SecureRH est une plateforme SaaS qui permet aux entreprises de :
- 🔍 **Détecter** les vulnérabilités techniques et organisationnelles
- 🤖 **Analyser** avec l'IA pour prioriser les actions
- 📊 **Visualiser** l'état de sécurité et conformité via des dashboards
- 🔧 **Remédier** avec des plans d'action automatiques
- ⚙️ **Automatiser** les flux avec n8n

## 🚀 Démarrage Rapide

### Prérequis
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose
- Compte OpenAI (pour l'IA)

### Installation

```bash
# Cloner le repository
git clone <repo-url>
cd secureRH

# Backend Django
cd backend
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend React
cd ../frontend
npm install

# Configurer les variables d'environnement
cd ../backend
cp .env.example .env
# Éditer .env avec vos configurations

# Démarrer la base de données
docker-compose up -d postgres redis

# Lancer les migrations Django
python manage.py migrate
python manage.py createsuperuser

# Démarrer le backend Django
python manage.py runserver

# Démarrer le frontend React (dans un autre terminal)
cd ../frontend
npm run dev
```

## 📁 Structure du Projet

```
secureRH/
├── frontend/              # Application React + Vite
│   ├── src/
│   │   ├── components/   # Composants React
│   │   ├── pages/        # Pages/Views
│   │   ├── services/     # Services API
│   │   ├── store/        # State management
│   │   └── utils/        # Utilitaires
│   └── public/           # Assets statiques
├── backend/              # API Django
│   ├── backend/          # Configuration Django
│   ├── apps/             # Applications Django
│   │   ├── accounts/     # Authentification
│   │   ├── tenants/      # Multi-tenancy
│   │   ├── audits/       # Module audits
│   │   ├── compliance/   # Module RGPD
│   │   └── ai/           # Service IA
│   └── manage.py
├── infrastructure/       # Terraform, Kubernetes
├── n8n-workflows/       # Workflows n8n
├── docs/                # Documentation
└── PROJET_PLAN.md       # Plan de projet complet
```

## 🛠️ Technologies

- **Frontend** : React 19, Vite, Tailwind CSS, React Router
- **Backend** : Django 5.2, Django REST Framework, PostgreSQL, Redis
- **IA** : OpenAI GPT-4
- **Automatisation** : n8n, Celery
- **Infrastructure** : AWS/Azure, Kubernetes, Docker

## 📚 Documentation

- [Plan de Projet Complet](./PROJET_PLAN.md) - Architecture, roadmap, budget
- [Guide Django + React](./DJANGO_REACT_SETUP.md) - Configuration complète Django + React
- [Architecture Technique](./ARCHITECTURE.md) - Architecture détaillée
- [Actions Immédiates](./ACTIONS_IMMEDIATES.md) - Plan d'action semaine par semaine
- [Structure du Projet](./STRUCTURE_PROJET.md) - Organisation du code

## 🔒 Sécurité

- Authentification MFA
- Chiffrement des données (AES-256)
- TLS 1.3
- Row-Level Security (PostgreSQL)
- Audit logs complets

## 📄 Licence

Propriétaire - Tous droits réservés

## 👥 Équipe

- Tech Lead
- Backend Developer
- Frontend Developer
- DevOps Engineer

## 📞 Contact

Pour toute question : [email]

---

**Status** : 🚧 En développement (MVP)

