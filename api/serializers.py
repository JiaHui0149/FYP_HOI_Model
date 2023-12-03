from rest_framework import serializers
from .models import Prediction, Video, Aggressor, Frames, Location  # Import your Prediction model


class PredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prediction
        fields = "__all__"


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = "__all__"


class AggressorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aggressor
        fields = "__all__"


class AlertsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Frames
        fields = "__all__"


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = "__all__"