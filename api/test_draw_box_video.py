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

test_dir = '../realme'
images = sorted(os.listdir(test_dir))
url_wd = 'http://0.0.0.0:8100/predictions/spfm_edge'
url_track = 'http://0.0.0.0:8100/predictions/spfm_tracker'
url_loitering = 'http://0.0.0.0:8100/predictions/spfm_loitering'

cap = cv2.VideoCapture("../video/aggressive_action_video1.mp4")

frame_width = 320  # Adjust this value to your preferred width
frame_height = 320  # Adjust this value to your preferred height

i = 1
temp = 1
while cap.isOpened():
    ret, frame = cap.read()
    
    if not ret:
        break
    
    frame = cv2.resize(frame, (frame_width, frame_height))

    _, buffer = cv2.imencode('.jpg', frame)
    
    frame_bytes = np.array(buffer).tobytes()
    
    payload = {}
    # print(image)
    payload['nvr_{}'.format(i)] = frame_bytes
    x = payload['nvr_{}'.format(i)]
    response = requests.post(url_wd, files=payload)
    print("SPFM WD latency: ",response.elapsed.total_seconds(),'seconds')
    response = response.json()
    print(response)
    bounding_boxes = response["wd_boxes"]
    wd_score = response["wd_scores"][0]
    
    x1, y1, x2, y2 = map(int, bounding_boxes[0]) 
    print("Frame ", i, ": ", wd_score)
    if float(wd_score) > 0.7:
        for box in bounding_boxes:
            x1, y1, x2, y2 = map(int, box)  # Convert coordinates to integers
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)  # Draw a green rectangle

        cv2.imwrite("image_with_boxes.jpg", frame)
        
        # Store 
        if temp == 1 or i > (temp + 20): 
            # Define the URL of your API endpoint
            temp = i
            api_url = 'http://127.0.0.1:8000/hoi/create-prediction'   
            
            image_base64 = base64.b64encode(frame).decode('utf-8')
            
            # # Define the prediction data
            # prediction_data = {
            #     'wd_scores': wd_score,
            #     'x1' : x1,
            #     'y1' : y1,
            #     'x2' : x2,
            #     'y2' : y2,
            #     'image': image_base64
            # }

            # # Send a POST request to create the prediction record
            # response = requests.post(api_url, json=prediction_data)

            # # Check the response
            # if response.status_code == 201:
            #     print("Prediction record created successfully.")
            #     response_data = response.json()
            #     print("Prediction ID:", response_data['prediction_id'])
            # else:
            #     print("Failed to create the prediction record.")
            #     print("Response:", response.text)
        
    cv2.imshow('Processed Video', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
    
    i += 1

cap.release()
cv2.destroyAllWindows()
