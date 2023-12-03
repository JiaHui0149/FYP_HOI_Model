from django.db import models
from django.utils import timezone

class Prediction(models.Model):
    code_id = models.TextField(unique=True, default = 0)
    frame_num = models.TextField()
    image = models.TextField(blank=True)
    timestamp = models.DateTimeField(default=timezone.now, blank=True) 
    wd_scores = models.FloatField(default=0, blank=True)

    def __str__(self):
        return self.frame_num

    class Meta:
        db_table = 'Prediction'


class Video(models.Model):
    Timeframe = models.FloatField()

    def __str__(self):
        return self.Timeframe

    class Meta:
        db_table = 'Video'


class Aggressor(models.Model):
    height_box = models.FloatField()
    weight_box = models.FloatField()

    def __str__(self):
        return self.id

    class Meta:
        db_table = 'Aggressor'

class Frames(models.Model):
    code_id = models.CharField(max_length=10, unique=True, blank=True)
    image = models.TextField()
    location = models.CharField(max_length=255)
    timestamp = models.DateTimeField() 

    
    def __str__(self):
        return self.id

    class Meta:
        db_table = 'Frames'


class Location(models.Model):
    location_name = models.CharField(max_length=255, unique = True)
    
    def __str__(self):
        return self.id

    class Meta:
        db_table = 'Location'