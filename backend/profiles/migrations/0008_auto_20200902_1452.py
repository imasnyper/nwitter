# Generated by Django 3.1 on 2020-09-02 18:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0007_auto_20200902_1442'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='following',
            name='following',
        ),
        migrations.AddField(
            model_name='following',
            name='follower',
            field=models.ManyToManyField(to='profiles.Profile'),
        ),
    ]
