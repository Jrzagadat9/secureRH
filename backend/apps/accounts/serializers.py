from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User
from apps.tenants.models import Tenant


class TenantSerializer(serializers.ModelSerializer):
    """Serializer pour les tenants"""
    class Meta:
        model = Tenant
        fields = ['id', 'name', 'subdomain', 'plan', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserSerializer(serializers.ModelSerializer):
    """Serializer pour les utilisateurs"""
    tenant = TenantSerializer(read_only=True)
    tenant_id = serializers.UUIDField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name',
            'role', 'tenant', 'tenant_id', 'mfa_enabled',
            'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer pour l'inscription"""
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password_confirm = serializers.CharField(write_only=True, required=True)
    tenant_name = serializers.CharField(write_only=True, required=False)
    tenant_subdomain = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'email', 'username', 'password', 'password_confirm',
            'first_name', 'last_name', 'tenant_name', 'tenant_subdomain'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                "password": "Les mots de passe ne correspondent pas."
            })
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        tenant_name = validated_data.pop('tenant_name', None)
        tenant_subdomain = validated_data.pop('tenant_subdomain', None)
        
        # Créer le tenant si fourni
        tenant = None
        if tenant_name and tenant_subdomain:
            tenant = Tenant.objects.create(
                name=tenant_name,
                subdomain=tenant_subdomain
            )
        
        # Créer l'utilisateur
        password = validated_data.pop('password')
        user = User.objects.create_user(
            tenant=tenant,
            password=password,
            **validated_data
        )
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer pour la connexion"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError(
                    "Identifiants invalides."
                )
            if not user.is_active:
                raise serializers.ValidationError(
                    "Ce compte est désactivé."
                )
            attrs['user'] = user
        else:
            raise serializers.ValidationError(
                "Email et mot de passe requis."
            )
        return attrs

