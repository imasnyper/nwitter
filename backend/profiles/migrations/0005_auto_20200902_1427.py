# Generated by Django 3.1 on 2020-09-02 18:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0004_auto_20200902_1426'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='following',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='profiles.profile'),
        ),
    ]
