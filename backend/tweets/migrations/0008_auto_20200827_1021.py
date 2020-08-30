# Generated by Django 3.1 on 2020-08-27 14:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tweets', '0007_remove_tweet_likes'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='retweet',
            name='id',
        ),
        migrations.RemoveField(
            model_name='retweet',
            name='profile',
        ),
        migrations.RemoveField(
            model_name='retweet',
            name='text',
        ),
        migrations.AddField(
            model_name='retweet',
            name='tweet_ptr',
            field=models.OneToOneField(auto_created=True, default=1, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tweets.tweet'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='retweet',
            name='tweet',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='something_else', to='tweets.tweet'),
        ),
    ]
