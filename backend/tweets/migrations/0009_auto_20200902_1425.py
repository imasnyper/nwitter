# Generated by Django 3.1 on 2020-09-02 18:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tweets', '0008_auto_20200827_1021'),
    ]

    operations = [
        migrations.AlterField(
            model_name='retweet',
            name='tweet',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='retweets', to='tweets.tweet'),
        ),
    ]