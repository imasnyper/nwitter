# Generated by Django 3.1 on 2020-08-14 17:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tweets', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='tweet',
            old_name='user',
            new_name='profile',
        ),
    ]
