#!/bin/bash

# Script de test pour l'authentification SecureRH

echo "🧪 Test de l'authentification SecureRH"
echo "======================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier si l'environnement virtuel existe
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}⚠️  Environnement virtuel non trouvé. Création...${NC}"
    python3 -m venv venv
    echo -e "${GREEN}✅ Environnement virtuel créé${NC}"
fi

# Activer l'environnement virtuel
echo -e "${YELLOW}📦 Activation de l'environnement virtuel...${NC}"
source venv/bin/activate

# Installer les dépendances
echo -e "${YELLOW}📥 Installation des dépendances...${NC}"
pip install -q -r requirements.txt

# Créer les migrations
echo -e "${YELLOW}🔄 Création des migrations...${NC}"
python manage.py makemigrations --noinput

# Appliquer les migrations
echo -e "${YELLOW}🗄️  Application des migrations...${NC}"
python manage.py migrate --noinput

echo ""
echo -e "${GREEN}✅ Configuration terminée !${NC}"
echo ""
echo "Pour démarrer le serveur Django :"
echo "  source venv/bin/activate"
echo "  python manage.py runserver"
echo ""
echo "Pour créer un superutilisateur :"
echo "  python manage.py createsuperuser"

