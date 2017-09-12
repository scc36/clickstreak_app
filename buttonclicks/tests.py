# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json

from django.test import Client, TestCase
from .models import StreakCount

class ButtonTestCase(TestCase):
    def setUp(self):
        StreakCount

    def test_streak_count_creation(self):
        """ StreakCount creates and defaults to 0 clicks """
        test_user = StreakCount.objects.create(user="test_user", click_count=0)
        self.assertEqual(test_user.click_count, 0)

    def test_get_streak_count(self):
        """ getting the streak count actually returns values"""
        # Make sure desired users are available
        StreakCount.objects.create(user="high score", click_count=0)

        # Get streaks
        c = Client()
        response = c.get('/streaks/')
        streaks = response.json()

        self.assertEqual(streaks["high_streak"], 0)

    def test_update_local_score(self):
        """ session updates user high score only: 5 < 100 """
        # Make sure desired users are available
        StreakCount.objects.create(user="high score", click_count=100)

        # Post an update streaks
        c = Client()
        response = post_response = c.post('/update_streaks/', content_type='application/json', data=json.dumps({'streakCount': 5}))
        streaks = response.json()

        self.assertEqual(streaks["user_streak"], 5)
        self.assertEqual(streaks["high_streak"], 100)

    def test_update_high_score(self):
        """ high score updates properly: 5 -> 10 """
        # Make sure desired users are available
        StreakCount.objects.create(user="high score", click_count=5)

        # Post an update streaks
        c = Client()
        response = post_response = c.post('/update_streaks/', content_type='application/json', data=json.dumps({'streakCount': 10}))
        streaks = response.json()

        self.assertEqual(streaks["user_streak"], 10)
        self.assertEqual(streaks["high_streak"], 10)
