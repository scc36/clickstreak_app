# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-14 04:42
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='StreakCount',
            fields=[
                ('user', models.CharField(max_length=40, primary_key=True, serialize=False)),
                ('click_count', models.IntegerField(default=0)),
            ],
        ),
    ]
