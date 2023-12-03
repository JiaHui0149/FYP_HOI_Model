# views.py
from rest_framework.response import Response
from rest_framework.decorators import api_view
import firebase_admin
from firebase_admin import credentials, firestore
from rest_framework import generics
from django.shortcuts import render
from django.http import JsonResponse
