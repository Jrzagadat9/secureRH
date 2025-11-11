# Structure de Projet Recommandée - SecureRH

## 📁 Structure Complète

```
secureRH/
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI/CD pipeline
│       └── deploy.yml          # Déploiement automatique
│
├── frontend/                    # Application React + Vite
│   ├── .env.local              # Variables d'environnement (local)
│   ├── .eslintrc.json          # Configuration ESLint
│   ├── .gitignore
│   ├── vite.config.js          # Configuration Vite
│   ├── package.json
│   ├── tailwind.config.js      # Configuration Tailwind
│   │
│   ├── src/
│   │   ├── App.jsx             # Composant principal
│   │   ├── main.jsx            # Point d'entrée
│   │   ├── index.css           # Styles globaux
│   │   │
│   │   ├── pages/              # Pages/Views
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Audits.jsx
│   │   │   ├── Compliance.jsx
│   │   │   └── Settings.jsx
│   │
│   ├── components/             # Composants React
│   │   ├── ui/                 # Composants UI de base
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   ├── dashboard/          # Composants dashboard
│   │   │   ├── SecurityDashboard.tsx
│   │   │   ├── ComplianceDashboard.tsx
│   │   │   └── MetricsCard.tsx
│   │   ├── audits/             # Composants audits
│   │   │   ├── AuditList.tsx
│   │   │   ├── AuditDetail.tsx
│   │   │   └── FindingsTable.tsx
│   │   └── layout/             # Composants de layout
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── Footer.tsx
│   │
│   ├── lib/                    # Utilitaires
│   │   ├── api.ts              # Client API
│   │   ├── auth.ts             # Gestion authentification
│   │   ├── utils.ts            # Fonctions utilitaires
│   │   └── constants.ts        # Constantes
│   │
│   ├── hooks/                  # React Hooks personnalisés
│   │   ├── useAuth.ts
│   │   ├── useAudits.ts
│   │   └── useDashboard.ts
│   │
│   ├── services/               # Services frontend
│   │   ├── api/
│   │   │   ├── audits.ts
│   │   │   ├── compliance.ts
│   │   │   └── users.ts
│   │   └── storage/
│   │       └── localStorage.ts
│   │
│   ├── types/                  # Types TypeScript
│   │   ├── audit.ts
│   │   ├── user.ts
│   │   └── api.ts
│   │
│   ├── styles/                 # Styles globaux
│   │   └── globals.css
│   │
│   └── public/                 # Assets statiques
│       ├── images/
│       └── icons/
│
├── backend/                    # API Django
│   ├── .env                    # Variables d'environnement
│   ├── .gitignore
│   ├── requirements.txt        # Dépendances Python
│   ├── manage.py               # Script de gestion Django
│   │
│   ├── backend/                # Configuration Django
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   │
│   ├── apps/                   # Applications Django
│   │   ├── accounts/           # Authentification
│   │   │   ├── models.py
│   │   │   ├── views.py
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   └── admin.py
│   │   │   │
│   │   ├── tenants/            # Multi-tenancy
│   │   │   ├── models.py
│   │   │   ├── views.py
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   └── middleware.py
│   │   │
│   │   ├── audits/             # Module audits
│   │   │   ├── models.py
│   │   │   ├── views.py
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   ├── tasks.py        # Tâches Celery
│   │   │   └── scanners/
│   │   │       ├── owasp_zap.py
│   │   │       └── nmap.py
│   │   │   │
│   │   ├── compliance/        # Module RGPD
│   │   │   ├── models.py
│   │   │   ├── views.py
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   └── services/
│   │   │       ├── rgpd_questionnaire.py
│   │   │       └── rgpd_analyzer.py
│   │   │
│   │   ├── ai/                # Service IA
│   │   │   ├── views.py
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   └── services/
│   │   │       ├── openai_client.py
│   │   │       ├── prioritization.py
│   │   │       └── prompts.py
│   │   │
│   │   ├── reports/           # Génération de rapports
│   │   │   ├── views.py
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   └── services/
│   │   │       └── pdf_generator.py
│   │   │
│   │   ├── remediation/      # Plans de remédiation
│   │   │   ├── models.py
│   │   │   ├── views.py
│   │   │   ├── serializers.py
│   │   │   └── urls.py
│   │   │
│   │   └── notifications/     # Notifications
│   │       ├── views.py
│   │       ├── serializers.py
│   │       ├── urls.py
│   │       └── channels/
│   │           ├── email.py
│   │           └── sms.py
│   │
│   ├── common/                # Code partagé
│   │   ├── middleware.py      # Middleware personnalisés
│   │   ├── permissions.py     # Permissions personnalisées
│   │   ├── utils.py           # Utilitaires
│   │   └── exceptions.py      # Exceptions personnalisées
│   │
│   ├── celery_app.py         # Configuration Celery
│   │
│   └── tests/                 # Tests
│       ├── test_models.py
│       ├── test_views.py
│       └── test_services.py
│
├── infrastructure/            # Infrastructure as Code
│   ├── terraform/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── modules/
│   │       ├── vpc/
│   │       ├── rds/
│   │       └── eks/
│   │
│   ├── kubernetes/
│   │   ├── namespace.yaml
│   │   ├── deployments/
│   │   │   ├── backend.yaml
│   │   │   └── frontend.yaml
│   │   ├── services/
│   │   │   ├── backend-service.yaml
│   │   │   └── frontend-service.yaml
│   │   └── ingress/
│   │       └── ingress.yaml
│   │
│   └── docker/
│       ├── Dockerfile.backend
│       ├── Dockerfile.frontend
│       └── docker-compose.prod.yml
│
├── n8n-workflows/             # Workflows n8n
│   ├── weekly-scan.json
│   ├── alert-critical.json
│   └── report-generation.json
│
├── docs/                      # Documentation
│   ├── API.md                 # Documentation API
│   ├── DEVELOPMENT.md         # Guide de développement
│   ├── DEPLOYMENT.md          # Guide de déploiement
│   └── USER_GUIDE.md          # Guide utilisateur
│
├── .gitignore
├── docker-compose.yml         # Docker Compose pour dev
├── README.md                  # README principal
├── PROJET_PLAN.md            # Plan de projet complet
├── ARCHITECTURE.md            # Architecture technique
├── ACTIONS_IMMEDIATES.md      # Actions immédiates
├── RESUME_EXECUTIF.md         # Résumé exécutif
└── STRUCTURE_PROJET.md        # Ce fichier
```

## 📝 Notes sur la Structure

### Frontend (Next.js)
- **App Router** : Utilise le nouveau système de routing de Next.js 14+
- **Composants** : Organisation par fonctionnalité (dashboard, audits, etc.)
- **Services** : Logique métier séparée des composants
- **Types** : Types TypeScript centralisés

### Backend (NestJS)
- **Modules** : Chaque module est indépendant (auth, audits, etc.)
- **DTOs** : Data Transfer Objects pour validation
- **Entities** : Modèles de données (TypeORM ou Prisma)
- **Workers** : Traitement asynchrone (scans, génération de rapports)

### Infrastructure
- **Terraform** : Infrastructure as Code
- **Kubernetes** : Orchestration des containers
- **Docker** : Containerisation

## 🚀 Commandes Utiles

### Développement Local

```bash
# Démarrer les services (PostgreSQL, Redis, etc.)
docker-compose up -d

# Backend Django
cd backend
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Celery Worker (dans un autre terminal)
cd backend
source venv/bin/activate
celery -A backend worker -l info

# Frontend React
cd frontend
npm install
npm run dev
```

### Tests

```bash
# Backend Django
cd backend
source venv/bin/activate
python manage.py test

# Frontend React
cd frontend
npm run test
```

### Déploiement

```bash
# Build
docker-compose -f docker-compose.prod.yml build

# Deploy
kubectl apply -f infrastructure/kubernetes/
```

---

*Document mis à jour : [Date]*

