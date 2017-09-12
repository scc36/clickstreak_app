# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json

from django.conf import settings
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.template import RequestContext, loader
from django.views.decorators.csrf import ensure_csrf_cookie

from .models import StreakCount

# Create your views here.
@ensure_csrf_cookie
def index(request):
    """
        Gateway host page
        The source of the CSRF Token used by update_streak
    """
    template = loader.get_template('index.html')
    context = {}
    return HttpResponse(template.render(context))

# Helper function to get high scores
def get_streak_counts(session_id):
    """
        Helper function to get streak counts
        returns session user and all-time streak counts

        Consider moving outside of views
    """

    try:
        user_streak = StreakCount.objects.get(user=session_id)
    except StreakCount.DoesNotExist:
        # No user found for session, so create it
        user_streak = StreakCount (user=session_id, click_count=0)

    # High score is pre-entered via fixture, so should always be present
    try:
        high_streak = StreakCount.objects.get(user=settings.HIGHSCORE_NAME)
    except StreakCount.DoesNotExist:
        print "We have an error here" #Should log instead
        high_streak = StreakCount (user=settings.HIGHSCORE_NAME, click_count=0)

    return (high_streak, user_streak)


# Add function to just return streak
def get_streak(request):
    """
        Return user and high score
    """
    # There's no log-in so identifying users via session
    session = request.session._get_or_create_session_key()

    (high_streak, user_streak) = get_streak_counts(session)
    # returns tuple of streak models

    response = JsonResponse({
                                "high_streak": high_streak.click_count,
                                "user_streak": user_streak.click_count
                            })
    return response

# Handle csrf cookie for cross account
def update_streak(request):
    """
        Update the high score based on the given streak score
        POST only
    """
    # There's no log-in so identifying users via session
    session = request.session._get_or_create_session_key()

    (high_streak, user_streak) = get_streak_counts(session)
    # returns tuple of streak models

    # If a new high score is provided, see if it's worth replacing
    if request.method == "POST":
        # Expect data to be passed in the body as a string json
        streak_data = json.loads(request.body)
        new_score = streak_data.get("streakCount", 0)

        if new_score > user_streak.click_count:
            user_streak.click_count = new_score
            user_streak.save()

        if user_streak.click_count > high_streak.click_count:
            high_streak.click_count = user_streak.click_count
            high_streak.save()

    response = JsonResponse({
                                "high_streak": high_streak.click_count,
                                "user_streak": user_streak.click_count
                            })
    return response
