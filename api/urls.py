from django.contrib import admin
from django.urls import path, include
from . import views


urlpatterns = [
    path('', views.getRoutes, name="routes"),
    path('prediction', views.fetch_predictions, name="prediction"),
    path('videos', views.fetch_videos, name="videos"),
    path('aggressors', views.fetch_aggressors, name="aggressors"),
    path('frames', views.fetch_alerts, name = "frames"),
    path('location', views.fetch_locations, name = "location"),
    path('create-prediction', views.create_prediction, name="create-prediction"),
    path('webcam_feed', views.webcam_feed, name='webcam_feed'),
    path('latest_record', views.get_latest_record, name='latest_record'),
]
