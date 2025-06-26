from django.db import models
import uuid

class Organisation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.TextField()
    email = models.EmailField(unique=True, null=True, blank=True)  # Optional email field
    website = models.URLField(null=True, blank=True)  # Optional website field
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.TextField()
    email = models.EmailField(unique=True)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    organisations = models.ManyToManyField(
        Organisation,
        through='Permission',
        related_name='users'
    )

class Permission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='organisation_permissions')
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE, related_name='user_permissions')
    role = models.CharField(max_length=100)
    permissions = models.JSONField(default=dict)  # Optional, flexible permission field
    updated_at = models.DateField(auto_now=True)
    class Meta:
        unique_together = ('user', 'organisation')

class Repository(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    github_url = models.CharField(unique=True, default="NA")
    name = models.CharField(max_length=255)
    installation_id = models.CharField(max_length=255)
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE, related_name='repositories')
    active = models.BooleanField(default=True)
    preferences = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return self.name
