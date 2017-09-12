# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.
class StreakCount(models.Model):
    """ Stores the highest click streaks
            distinct per user (session)
            project also assumes a "high score" user.py
    """
    user = models.CharField(max_length=40, primary_key=True)
    click_count = models.IntegerField(default=0)
    def __unicode__(self):
        return str(self.click_count)
