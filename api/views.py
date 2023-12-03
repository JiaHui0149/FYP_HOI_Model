# views.py
from rest_framework.decorators import api_view
import firebase_admin
from firebase_admin import credentials, firestore
from django.http import JsonResponse
from .serializers import PredictionSerializer, VideoSerializer, AggressorSerializer, AlertsSerializer, LocationSerializer
import base64
from django.shortcuts import render
from django.http.response import StreamingHttpResponse
import cv2,os,urllib.request
from api.camera import IPWebCam
import cv2 
import requests
import numpy as np
import requests
import json
import base64
import cv2
import io
import os
import numpy as np
from PIL import Image, ImageDraw
from datetime import datetime

def getRoutes(request):
    return JsonResponse('Our API Second Version', safe=False)

url_wd = 'http://0.0.0.0:8100/predictions/spfm_edge'

# Get Firebase
# Replace with the actual path to your service account key
cred = credentials.Certificate("./Firebase/firebase2.json")
firebase_admin.initialize_app(cred)

# Initialize Firestore client
firestore_client = firestore.client()

@api_view(['GET'])
def fetch_predictions(request):

    predictions_collection = firestore_client.collection("Prediction")
    print(predictions_collection)

    predictions = []
    for doc in predictions_collection.stream():
        data = doc.to_dict()
        predictions.append(data)

    serializer = PredictionSerializer(data=predictions, many=True)

    if serializer.is_valid():
        return JsonResponse(serializer.data, safe=False)
    else:
        return JsonResponse(serializer.errors, status=400, safe=False)


@api_view(['GET'])
def fetch_videos(request):

    videos_collection = firestore_client.collection("Video")
    print(videos_collection)

    videos = []
    for doc in videos_collection.stream():
        data = doc.to_dict()
        videos.append(data)

    serializer = VideoSerializer(data=videos, many=True)

    if serializer.is_valid():
        return JsonResponse(serializer.data, safe=False)
    else:
        return JsonResponse(serializer.errors, status=400, safe=False)


@api_view(['GET'])
def fetch_aggressors(request):

    aggrressors_collection = firestore_client.collection("Aggressor")
    print(aggrressors_collection)

    aggressors = []
    for doc in aggrressors_collection.stream():
        data = doc.to_dict()
        aggressors.append(data)

    serializer = AggressorSerializer(data=aggressors, many=True)

    if serializer.is_valid():
        return JsonResponse(serializer.data, safe=False)
    else:
        return JsonResponse(serializer.errors, status=400, safe=False)

@api_view(['POST'])
def create_prediction(request):
    if request.method == 'POST':
        # Assuming you receive the prediction data as JSON
        prediction_data = request.data
        # You can add validation and data transformation here if needed
        # For example, you can use a serializer to validate and format the data

        # Store the prediction data in Firestore
        predictions_collection = firestore_client.collection("Prediction")
        new_prediction_ref = predictions_collection.add(prediction_data)

        # Return a response with the ID of the newly created prediction
        return JsonResponse({'message': 'Prediction created', 'prediction_id': new_prediction_ref.id}, status=201)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    
@api_view(['GET'])
def fetch_alerts(request):

    alerts_collection = firestore_client.collection("Frames")
    print(alerts_collection)
    images = []
    alerts = []
    for doc in alerts_collection.stream():
        data = doc.to_dict()
        images.append(data.get("image", None))
        alerts.append(data)

    serializer = AlertsSerializer(data=alerts, many=True)
    data_uri = images[0]
    data_parts = data_uri.split(',')
    base64_data = data_parts[1]

    # Decode the Base64 data to obtain the binary image data
    binary_image_data = base64.b64decode(base64_data)

    # Convert the binary image data to a byte array
    byte_array = bytes(binary_image_data)
    print(byte_array[:20])
    
    if serializer.is_valid():
        return JsonResponse(serializer.data, safe=False)
    else:
        return JsonResponse(serializer.errors, status=400, safe=False)


@api_view(['GET'])
def fetch_locations(request):
    location_collection = firestore_client.collection("Location")
    print(location_collection)

    locations = []
    for doc in location_collection.stream():
        data = doc.to_dict()
        locations.append(data)

    serializer = LocationSerializer(data=locations, many=True)

    if serializer.is_valid():
        return JsonResponse(serializer.data, safe=False)
    else:
        return JsonResponse(serializer.errors, status=400, safe=False)
    
@api_view(['GET'])
def get_latest_record(request):
    predictions_collection = firestore_client.collection("Prediction")
    
    all_records = predictions_collection.stream()
    
    latest_record = None
    latest_timestamp = None

    for record in all_records:
        data = record.to_dict()
        if "timestamp" in data:
            timestamp = data["timestamp"]

            if latest_timestamp is None or timestamp > latest_timestamp:
                latest_timestamp = timestamp
                latest_record = record
            
    if latest_record:
        latest_data = latest_record.to_dict()
        return JsonResponse(latest_data)
    else:
        return JsonResponse({"message": "No records found"}, status=404)
    
def get_latest_id(): 
    predictions_collection = firestore_client.collection("Prediction")
    
    all_records = predictions_collection.stream()
    
    latest_code_id = None

    for record in all_records:
        data = record.to_dict()
        if "code_id" in data:
            code_id = data["code_id"]

            if code_id is not None and (latest_code_id is None or code_id > latest_code_id):
                latest_code_id = code_id

    if latest_code_id is None: 
        latest_code_id = 10000
    
    return latest_code_id

def gen(camera):
    
    # Get the latest ID
    latest_id = get_latest_id()
    print("Latest ID: ", latest_id)
    
    boundary = "frame"
    temp = 1
    i = camera.frame_num
    crime_detected = False
    while True:
        imgNp = camera.get_frame()
        
        img= cv2.imdecode(imgNp,-1)
        
        payload = {}
        payload['nvr_{}'.format(i)] = imgNp
        x = payload['nvr_{}'.format(i)]
        response = requests.post(url_wd, files=payload)
        # print("SPFM WD latency: ",response.elapsed.total_seconds(),'seconds')
        response = response.json()
        # print(response)
        bounding_boxes = response["wd_boxes"]
        wd_score = response["wd_scores"][0]
    
        x1, y1, x2, y2 = map(int, bounding_boxes[0]) 
        print("Frame ", i, ": ", wd_score)
        if float(wd_score) > 0.6: # Convert coordinates to integers
            cv2.rectangle(img, pt1=(x1, y1), pt2=(x2, y2), color=(255, 0, 0), thickness=2)
            crime_detected = True

            # cv2.rectangle(frame_with_rectangle, (x1, y1), (x2, y2), (0, 255, 0), 2)  # Draw a green rectangle
        
        resize = cv2.resize(img, (640, 480), interpolation = cv2.INTER_LINEAR) 
        frame_flip = cv2.flip(resize,1)
        ret, jpeg = cv2.imencode('.jpg', frame_flip)
        image_base64 = base64.b64encode(jpeg).decode('utf-8')
        output_frame = jpeg.tobytes()
        
        # Store 
        if crime_detected and (temp == 1 or i > (temp + 80)): 
            latest_id += 1
            # Define the URL of your API endpoint
            temp = i
            api_url = 'http://127.0.0.1:8000/hoi/create-prediction'   
            
            timestamp = datetime.now().isoformat()
            
            # Define the prediction data
            prediction_data = {
                'wd_scores': wd_score,
                'x1' : x1,
                'y1' : y1,
                'x2' : x2,
                'y2' : y2,
                'frame_num' : i,
                'image': image_base64,
                'timestamp': timestamp,
                'code_id' : latest_id
            }
            # Send a POST request to create the prediction record
            response = requests.post(api_url, json=prediction_data)

            # Check the response
            if response.status_code == 201:
                print("Prediction record created successfully.")
                response_data = response.json()
                print("Prediction ID:", response_data['code_id'])
            else:
                print("Failed to create the prediction record.")
                # print("Response:", response.text)
                
        yield (
        b'--' + boundary.encode('utf-8') + b'\r\n' +
        b'Content-Type: image/jpeg\r\n\r\n' +
        output_frame + b'\r\n'
    )
        i += 1
    

def gen2(camera):
    # Get the latest ID
    latest_id = get_latest_id()
    print(latest_id)
    
    boundary = "frame"
    temp = 1
    i = camera.frame_num
    crime_detected = True
    while True:
        
        imgNp = camera.get_frame()
        
        img= cv2.imdecode(imgNp,-1)
        
        resize = cv2.resize(img, (640, 480), interpolation = cv2.INTER_LINEAR) 
        frame_flip = cv2.flip(resize,1)
        ret, jpeg = cv2.imencode('.jpg', frame_flip)
        image_base64 = base64.b64encode(jpeg).decode('utf-8')
        output_frame = jpeg.tobytes()
        
        wd_score = 0.88
        x1 = 100
        x2 = 200
        y1 = 300
        y2 = 400
        
        # Store 
        if crime_detected and (temp == 1 or i > (temp + 30)): 
            # Define the URL of your API endpoint
            temp = i
            api_url = 'http://127.0.0.1:8000/hoi/create-prediction'   
            
            timestamp = datetime.now().isoformat()
            latest_id += 1
            # Define the prediction data
            prediction_data = {
                'wd_scores': wd_score,
                'x1' : x1,
                'y1' : y1,
                'x2' : x2,
                'y2' : y2,
                'frame_num' : i,
                'image': image_base64,
                'timestamp': timestamp,
                'code_id' : latest_id
            }
            # Send a POST request to create the prediction record
            response = requests.post(api_url, json=prediction_data)

            # Check the response
            if response.status_code == 201:
                print("Prediction record created successfully.")
                response_data = response.json()
                print("Prediction ID:", response_data['prediction_id'])
            else:
                print("Failed to create the prediction record.")
                print("Response:", response.text)
    
        yield (
        b'--' + boundary.encode('utf-8') + b'\r\n' +
        b'Content-Type: image/jpeg\r\n\r\n' +
        output_frame + b'\r\n'
    )
        i += 1
        
        
def webcam_feed(request):
	return StreamingHttpResponse(gen2(IPWebCam()), content_type='multipart/x-mixed-replace; boundary=frame')


get_latest_id()