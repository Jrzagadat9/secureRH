#!/usr/bin/env python3
"""
Script de test rapide pour l'authentification
Usage: python quick_test.py
"""

import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Utiliser SQLite pour les tests rapides
os.environ['DB_ENGINE'] = 'sqlite3'

django.setup()

from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.tenants.models import Tenant
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

def test_authentication():
    """Test rapide de l'authentification"""
    print("🧪 Test de l'authentification SecureRH")
    print("=" * 50)
    
    # Créer un client API
    client = APIClient()
    
    # Test 1: Inscription
    print("\n1️⃣  Test d'inscription...")
    register_data = {
        'email': 'test@example.com',
        'username': 'testuser',
        'password': 'Test1234!',
        'password_confirm': 'Test1234!',
        'first_name': 'Test',
        'last_name': 'User'
    }
    
    response = client.post('/api/auth/register/', register_data, format='json')
    
    if response.status_code == status.HTTP_201_CREATED:
        print("   ✅ Inscription réussie")
        access_token = response.data.get('access')
        refresh_token = response.data.get('refresh')
        user_data = response.data.get('user')
        print(f"   📧 Email: {user_data.get('email')}")
        print(f"   🔑 Access token reçu: {access_token[:20]}...")
    else:
        print(f"   ❌ Erreur d'inscription: {response.status_code}")
        print(f"   Détails: {response.data}")
        return False
    
    # Test 2: Connexion
    print("\n2️⃣  Test de connexion...")
    login_data = {
        'email': 'test@example.com',
        'password': 'Test1234!'
    }
    
    response = client.post('/api/auth/login/', login_data, format='json')
    
    if response.status_code == status.HTTP_200_OK:
        print("   ✅ Connexion réussie")
        access_token = response.data.get('access')
    else:
        print(f"   ❌ Erreur de connexion: {response.status_code}")
        print(f"   Détails: {response.data}")
        return False
    
    # Test 3: Récupérer les infos utilisateur
    print("\n3️⃣  Test de récupération des infos utilisateur...")
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
    response = client.get('/api/auth/me/')
    
    if response.status_code == status.HTTP_200_OK:
        print("   ✅ Récupération réussie")
        print(f"   👤 Utilisateur: {response.data.get('email')}")
    else:
        print(f"   ❌ Erreur: {response.status_code}")
        print(f"   Détails: {response.data}")
        return False
    
    # Test 4: Refresh token
    print("\n4️⃣  Test de refresh token...")
    client.credentials()  # Retirer l'ancien token
    refresh_data = {'refresh': refresh_token}
    response = client.post('/api/auth/refresh/', refresh_data, format='json')
    
    if response.status_code == status.HTTP_200_OK:
        print("   ✅ Refresh token réussi")
        new_access_token = response.data.get('access')
        print(f"   🔑 Nouveau access token: {new_access_token[:20]}...")
    else:
        print(f"   ❌ Erreur de refresh: {response.status_code}")
        print(f"   Détails: {response.data}")
        return False
    
    print("\n" + "=" * 50)
    print("✅ Tous les tests sont passés avec succès !")
    return True

if __name__ == '__main__':
    try:
        # S'assurer que les migrations sont appliquées
        from django.core.management import call_command
        call_command('migrate', verbosity=0, interactive=False)
        
        success = test_authentication()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Erreur: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

