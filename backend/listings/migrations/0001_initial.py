# Generated by Django 5.0.8 on 2024-08-25 14:08

import django.db.models.deletion
import listings.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Listing',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('listing_type', models.CharField(
                    choices=listings.models.listing_types, max_length=20)),
                ('property_type', models.CharField(
                    choices=listings.models.property_types, max_length=20)),
                ('price', models.PositiveIntegerField()),
                ('image', models.ImageField(blank=True, null=True, upload_to='')),
                ('property_size', models.PositiveIntegerField(blank=True, null=True)),
                ('description', models.TextField(blank=True)),
                ('is_available', models.BooleanField(default=False)),
                ('bedrooms', models.PositiveIntegerField(blank=True, null=True)),
                ('bathrooms', models.PositiveIntegerField(blank=True, null=True)),
                ('province', models.CharField(max_length=100)),
                ('city', models.CharField(max_length=100)),
                ('baranggay', models.CharField(max_length=100)),
                ('street', models.CharField(max_length=100)),
                ('owner', models.OneToOneField(
                    on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]