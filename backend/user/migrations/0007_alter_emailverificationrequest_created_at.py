# Generated by Django 5.0.8 on 2024-08-15 05:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0006_emailverificationrequest_created_at_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='emailverificationrequest',
            name='created_at',
            field=models.DateField(auto_now_add=True),
        ),
    ]
