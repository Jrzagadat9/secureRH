#!/bin/bash

# Script de test pour le module Audit

echo "🧪 Test du Module Audit - SecureRH"
echo "=================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Obtenir un token
echo -e "${YELLOW}1. Authentification...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Test1234!"}')

if echo "$LOGIN_RESPONSE" | grep -q "access"; then
    TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['access'])" 2>/dev/null)
    echo -e "${GREEN}✅ Authentification réussie${NC}"
else
    echo -e "${RED}❌ Erreur d'authentification${NC}"
    echo "$LOGIN_RESPONSE"
    exit 1
fi

# 2. Créer un audit
echo ""
echo -e "${YELLOW}2. Création d'un audit...${NC}"
AUDIT_RESPONSE=$(curl -s -X POST http://localhost:8000/api/audits/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Audit Test Automatique",
    "type": "technical",
    "target": "https://example.com",
    "description": "Audit créé par le script de test"
  }')

if echo "$AUDIT_RESPONSE" | grep -q "id"; then
    AUDIT_ID=$(echo "$AUDIT_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
    echo -e "${GREEN}✅ Audit créé avec succès${NC}"
    echo "   ID: $AUDIT_ID"
else
    echo -e "${RED}❌ Erreur lors de la création${NC}"
    echo "$AUDIT_RESPONSE"
    exit 1
fi

# 3. Déclencher un scan
echo ""
echo -e "${YELLOW}3. Déclenchement d'un scan...${NC}"
SCAN_RESPONSE=$(curl -s -X POST "http://localhost:8000/api/audits/$AUDIT_ID/trigger_scan/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"target": "https://example.com", "scan_type": "full"}')

if echo "$SCAN_RESPONSE" | grep -q "Scan déclenché"; then
    echo -e "${GREEN}✅ Scan déclenché avec succès${NC}"
    echo "   Attente de 5 secondes pour le traitement..."
    sleep 5
else
    echo -e "${YELLOW}⚠️  Réponse: $SCAN_RESPONSE${NC}"
fi

# 4. Récupérer les détails de l'audit
echo ""
echo -e "${YELLOW}4. Récupération des détails de l'audit...${NC}"
sleep 2
AUDIT_DETAIL=$(curl -s -X GET "http://localhost:8000/api/audits/$AUDIT_ID/" \
  -H "Authorization: Bearer $TOKEN")

echo "$AUDIT_DETAIL" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(f\"   Nom: {data.get('name')}\")
print(f\"   Statut: {data.get('status')}\")
print(f\"   Score: {data.get('score')}\")
print(f\"   Total findings: {data.get('total_findings')}\")
if data.get('findings'):
    print(f\"   Findings: {len(data['findings'])} détectés\")
    for f in data['findings'][:3]:
        print(f\"     - {f.get('title')} ({f.get('severity')})\")
" 2>/dev/null || echo "$AUDIT_DETAIL"

# 5. Statistiques
echo ""
echo -e "${YELLOW}5. Statistiques globales...${NC}"
STATS=$(curl -s -X GET http://localhost:8000/api/audits/stats/ \
  -H "Authorization: Bearer $TOKEN")

echo "$STATS" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(f\"   Total audits: {data.get('total_audits', 0)}\")
print(f\"   Audits terminés: {data.get('completed_audits', 0)}\")
print(f\"   Findings critiques: {data.get('critical_findings', 0)}\")
print(f\"   Score moyen: {round(data.get('average_score', 0), 1)}/100\")
" 2>/dev/null || echo "$STATS"

echo ""
echo -e "${GREEN}✅ Tests terminés !${NC}"
echo ""
echo "Pour tester dans le navigateur:"
echo "  - Frontend: http://localhost:5173"
echo "  - API Docs: http://localhost:8000/api/docs/"

