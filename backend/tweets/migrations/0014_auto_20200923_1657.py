# Generated by Django 3.1.1 on 2020-09-23 20:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tweets', '0013_remove_tweet_retweet_profile'),
    ]

    operations = [
        migrations.AddField(
            model_name='tweet',
            name='reply',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='replied', to='tweets.tweet'),
        ),
        migrations.AlterField(
            model_name='tweet',
            name='retweet',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='retweets', to='tweets.tweet'),
        ),
    ]
