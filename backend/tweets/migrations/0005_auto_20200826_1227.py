# Generated by Django 3.1 on 2020-08-26 16:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0003_auto_20200814_1327'),
        ('tweets', '0004_auto_20200826_1221'),
    ]

    operations = [
        migrations.AlterField(
            model_name='like',
            name='liker',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='profiles.profile'),
        ),
    ]