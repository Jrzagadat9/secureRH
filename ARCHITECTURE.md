# Architecture Technique - SecureRH

## 🏗️ Vue d'Ensemble

SecureRH suit une architecture microservices avec séparation claire entre frontend, backend, et services externes.

## 📐 Schéma d'Architecture Détaillé

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React App (Vite + Client-side)                     │   │
│  │  - Dashboard                                        │   │
│  │  - Audits                                          │   │
│  │  - Rapports                                        │   │
│  │  - Settings                                        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS (TLS 1.3)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    CDN / WAF (Cloudflare)                    │
│  - DDoS Protection                                          │
│  - Rate Limiting                                            │
│  - SSL Termination                                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY (Kong)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Auth        │  │  Rate Limit  │  │  Request     │     │
│  │  Plugin      │  │  Plugin      │  │  Validation  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND SERVICES (Django REST Framework)        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Auth Service                                        │  │
│  │  - Login/Register                                    │  │
│  │  - JWT Management                                    │  │
│  │  - MFA                                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Audit Service                                       │  │
│  │  - Trigger Scans                                     │  │
│  │  - Store Results                                    │  │
│  │  - Generate Reports                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Compliance Service                                  │  │
│  │  - RGPD Questionnaire                                │  │
│  │  - Compliance Scoring                                │  │
│  │  - Gap Analysis                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  AI Service                                          │  │
│  │  - Prioritize Findings                               │  │
│  │  - Generate Remediation Plans                        │  │
│  │  - Chatbot                                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Notification Service                                │  │
│  │  - Email                                             │  │
│  │  - SMS                                               │  │
│  │  - Webhooks                                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    MESSAGE QUEUE (RabbitMQ)                 │
│  - Async Processing                                        │
│  - Job Queue                                              │
│  - Event Bus                                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    WORKERS (Background Jobs)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Scan        │  │  Report      │  │  AI          │     │
│  │  Worker      │  │  Generator   │  │  Processor   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PostgreSQL (Primary DB)                             │  │
│  │  - Multi-tenant with RLS                             │  │
│  │  - Users, Tenants, Audits, Findings                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Redis (Cache + Sessions)                            │  │
│  │  - Session Storage                                   │  │
│  │  - Rate Limiting                                     │  │
│  │  - Cache                                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Elasticsearch (Logs + Search)                       │  │
│  │  - Application Logs                                  │  │
│  │  - Audit Logs                                       │  │
│  │  - Full-text Search                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  S3 / MinIO (Object Storage)                         │  │
│  │  - Reports (PDF)                                     │  │
│  │  - Attachments                                      │  │
│  │  - Backups                                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  OpenAI      │  │  n8n         │  │  Scanners    │     │
│  │  GPT-4 API   │  │  Workflows   │  │  (OWASP ZAP, │     │
│  │              │  │              │  │   Nmap, etc.)│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Auth0 /     │  │  SendGrid    │  │  Twilio      │     │
│  │  Keycloak    │  │  (Email)     │  │  (SMS)       │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Multi-Tenancy

### Stratégie : Row-Level Security (RLS)

Chaque table contient un `tenant_id` et PostgreSQL RLS garantit l'isolation.

```sql
-- Exemple de table avec RLS
CREATE TABLE audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Activation RLS
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

-- Politique d'isolation
CREATE POLICY tenant_isolation ON audits
    FOR ALL
    TO application_user
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

### Contexte Tenant dans l'Application

```typescript
// Middleware NestJS pour extraire tenant_id
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const tenantId = this.extractTenantId(req); // Depuis JWT ou subdomain
    req['tenantId'] = tenantId;
    // Set PostgreSQL session variable
    next();
  }
}
```

## 🔄 Flux de Données

### 1. Flux d'Authentification

```
Client → API Gateway → Auth Service → Auth0/Keycloak
                                    ↓
                              JWT Token
                                    ↓
Client ← API Gateway ← Auth Service
```

### 2. Flux d'Audit

```
Client → API Gateway → Audit Service → Queue (RabbitMQ)
                                    ↓
                              Scan Worker
                                    ↓
                              External Scanner (OWASP ZAP)
                                    ↓
                              Store Results (PostgreSQL)
                                    ↓
                              Trigger AI Analysis
                                    ↓
                              Generate Report (PDF)
                                    ↓
                              Notify User (Email)
```

### 3. Flux IA

```
Audit Results → AI Service → OpenAI API
                          ↓
                    Prioritized Findings
                          ↓
                    Generate Remediation Plan
                          ↓
                    Store in DB
                          ↓
                    Update Dashboard
```

## 📊 Base de Données

### Schéma Principal

```sql
-- Tenants
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    mfa_enabled BOOLEAN DEFAULT false,
    mfa_secret VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, email)
);

-- Audits
CREATE TABLE audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'technical', 'organizational', 'rgpd'
    status VARCHAR(50) NOT NULL, -- 'pending', 'running', 'completed', 'failed'
    target VARCHAR(500), -- URL, IP, domain
    score INTEGER, -- 0-100
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Findings
CREATE TABLE findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
    severity VARCHAR(20) NOT NULL, -- 'critical', 'high', 'medium', 'low', 'info'
    title VARCHAR(500) NOT NULL,
    description TEXT,
    recommendation TEXT,
    cwe VARCHAR(20),
    cvss DECIMAL(3,1),
    category VARCHAR(100),
    priority_score INTEGER, -- Calculated by AI
    created_at TIMESTAMP DEFAULT NOW()
);

-- Remediation Plans
CREATE TABLE remediation_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'draft',
    priority VARCHAR(20),
    estimated_completion DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Remediation Tasks
CREATE TABLE remediation_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES remediation_plans(id) ON DELETE CASCADE,
    finding_id UUID NOT NULL REFERENCES findings(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'todo',
    due_date DATE,
    estimated_hours INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔌 Intégrations

### OpenAI Integration

```typescript
// services/ai.service.ts
@Injectable()
export class AIService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  async prioritizeFindings(findings: Finding[]): Promise<PrioritizedFinding[]> {
    const prompt = this.buildPrioritizationPrompt(findings);
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: PRIORITIZATION_SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    });
    return JSON.parse(response.choices[0].message.content);
  }
}
```

### n8n Integration

n8n est déployé séparément et communique avec l'API SecureRH via webhooks.

```typescript
// controllers/webhooks.controller.ts
@Controller('webhooks')
export class WebhooksController {
  @Post('n8n')
  async handleN8nWebhook(@Body() payload: any) {
    // Traiter les événements depuis n8n
    // Ex: Nouveau scan déclenché, résultats d'audit, etc.
  }
}
```

## 🚀 Déploiement

### Kubernetes

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: securerh-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: securerh-backend
  template:
    metadata:
      labels:
        app: securerh-backend
    spec:
      containers:
      - name: backend
        image: securerh/backend:latest
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: redis-secret
              key: url
```

### CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker Image
        run: docker build -t securerh/backend:${{ github.sha }} .
      - name: Push to Registry
        run: docker push securerh/backend:${{ github.sha }}
      - name: Deploy to Kubernetes
        run: kubectl set image deployment/securerh-backend backend=securerh/backend:${{ github.sha }}
```

## 📈 Monitoring

### Métriques Clés
- Latence API (p50, p95, p99)
- Taux d'erreur
- Utilisation CPU/Memory
- Taille de la base de données
- Nombre d'audits par jour
- Coût OpenAI par mois

### Outils
- **Prometheus** : Collecte de métriques
- **Grafana** : Visualisation
- **Sentry** : Error tracking
- **ELK Stack** : Logs

---

*Document mis à jour : [Date]*

