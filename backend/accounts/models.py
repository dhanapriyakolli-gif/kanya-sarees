from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )

    name = models.CharField(max_length=100)

    phone = models.CharField(max_length=10)

    address = models.TextField(blank=True)

    city = models.CharField(
        max_length=100,
        blank=True
    )

    pincode = models.CharField(
        max_length=6,
        blank=True
    )

    def __str__(self):
        return self.user.username