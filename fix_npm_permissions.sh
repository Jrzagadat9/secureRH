#!/bin/bash

# Script pour corriger les permissions npm
# À exécuter avec sudo si nécessaire

echo "🔧 Correction des permissions npm..."

# Option 1 : Corriger les permissions du cache npm
if [ -d "$HOME/.npm" ]; then
    echo "Correction des permissions de ~/.npm..."
    sudo chown -R $(whoami):$(id -gn) "$HOME/.npm"
fi

# Option 2 : Utiliser un cache npm local
echo "Configuration d'un cache npm local..."
mkdir -p "$HOME/.npm-cache"
npm config set cache "$HOME/.npm-cache"

echo "✅ Permissions corrigées !"
echo ""
echo "Vous pouvez maintenant exécuter :"
echo "  cd frontend"
echo "  npm install --legacy-peer-deps"

