from rest_framework import serializers
from .models import Organisation, User, Permission, Repository

class OrganisationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organisation
        fields = ['id', 'name', 'created_at', 'updated_at', 'repositories']

class PermissionSerializer(serializers.ModelSerializer):
    organisation = serializers.PrimaryKeyRelatedField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Permission
        fields = ['user', 'organisation', 'role', 'permissions', 'updated_at']

class UserSerializer(serializers.ModelSerializer):
    organisation_permissions = PermissionSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'created_at', 'updated_at', 'organisation_permissions']

class RepositorySerializer(serializers.ModelSerializer):
    organisation = serializers.PrimaryKeyRelatedField(queryset=Organisation.objects.all())

    class Meta:
        model = Repository
        fields = [
            'id', 'github_url', 'name', 'installation_id',
            'organisation', 'active', 'preferences',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


## Frontend use
class PermissionDetailSerializer(serializers.ModelSerializer):
    organisation_id = serializers.UUIDField(source='organisation.id')
    organisation_name = serializers.CharField(source='organisation.name')

    class Meta:
        model = Permission
        fields = ['organisation_id', 'organisation_name', 'role', 'permissions']

class UserOrgInfoSerializer(serializers.ModelSerializer):
    organisation_permissions = PermissionDetailSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'organisation_permissions']

class RepositorySummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Repository
        fields = ['id', 'name', 'github_url', 'active', 'installation_id']

class OrganisationBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organisation
        fields = ['id', 'name']
