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

for i, image in enumerate(images):
    payload = {}
    image = open(os.path.join(test_dir,image), 'rb')
    # print(image)
    payload['nvr_{}'.format(i)] = image.read()
    x = payload['nvr_{}'.format(i)]
    print("Image Data: ", x)     
    # response = requests.post(url_wd, files=payload)
    # print("SPFM WD latency: ",response.elapsed.total_seconds(),'seconds')
    # response = response.json()
    # print(response)

# payload['source'] = 'nvrch20'
# payload['datetime'] = '2023-02-06 11:25:07.461007'

# response = requests.post(url_loitering, files=payload)
# print("SPFM WD latency: ",response.elapsed.total_seconds(),'seconds')
# response = response.json()
# print(response)
# response = requests.post(url_track, files=payload)
# print("SPFM track latency: ",response.elapsed.total_seconds(),'seconds')
# response = response.json()


##########################
# preds = {key: [] for key in ["crime_scores", "det_bboxes","track_frame_id",
#                              "person_id","track_bboxes"]}
# crime_payload = {}
# crime_frames = list(payload.values())

# for i, image in enumerate(images):
#     crime_score = response['results'][i]['verb_scores'][0][0]
#     bbox = response['results'][i]['boxes'][0]
#     preds['crime_scores'].append(crime_score)
#     preds['det_bboxes'].append(bbox)
#     # preds['crime_scores'].append(0.85)
#     # preds['det_bboxes'].append([1001, 370, 1235, 900])

# preds['crime_scores'] = np.asarray(preds['crime_scores'])
# crime_idx = np.where(preds['crime_scores']>=0.5)[0] ## CRIME SCORE THRESHOLD
# preds['track_frame_id'] = crime_idxponse_length):
#     if response['wd_results']['verb_scores'][i]>=0.5:
#         bbox = response['wd_results']['boxes'][i]
#         # track_id = track_bboxes[0][-1]
#         img = Image.open(io.BytesIO(payload['nvr_{}'.format(i)]))
#         # wd_bbox = eval(payload['det_bbox_{}'.format(i)])
#         img1 = ImageDraw.Draw(img)  
#         img1.rectangle(bbox, outline ="red")
#         # img1.rectangle(wd_bbox, outline='green')
#         img.show()

# if len(preds['track_frame_id']>0):
#     crime_payload = {}
#     crime_frames = list(payload.values())
#     for i,idx in enumerate(preds['track_frame_id']):
#         crime_payload['nvr_{}'.format(i)] = crime_frames[idx]
#         crime_payload['det_bbox_{}'.format(i)] = str(preds['det_bboxes'][idx])
#     response = requests.post(url_track, files=crime_payload)

# print("SPFM Tracking latency: ",response.elapsed.total_seconds(),'seconds')
# response = response.json()

# for i,track_bboxes in enumerate(response):
#     if len(track_bboxes) > 0:
#         track_bbox = response[i]
#         # track_id = track_bboxes[0][-1]
#         img = Image.open(io.BytesIO(payload['nvr_{}'.format(i)]))
#         # wd_bbox = eval(payload['det_bbox_{}'.format(i)])
#         print(track_bbox)
#         img1 = ImageDraw.Draw(img)  
#         img1.rectangle(track_bbox, outline ="red")
#         # img1.rectangle(wd_bbox, outline='green')
#         img.show()

##############################
# response = requests.post(url_wd, files={'case_status': 'True'})
# response = requests.post(url_wd, files=payload)
# print("SPFM Main latency: ",response.elapsed.total_seconds(),'seconds')
# response = response.json()
# print(response)
# response_length = len(response['wd_results']['boxes'])

# for i in range(response_length):
#     if response['wd_results']['verb_scores'][i]>=0.5:
#         bbox = response['wd_results']['boxes'][i]
#         # track_id = track_bboxes[0][-1]
#         img = Image.open(io.BytesIO(payload['nvr_{}'.format(i)]))
#         # wd_bbox = eval(payload['det_bbox_{}'.format(i)])
#         img1 = ImageDraw.Draw(img)  
#         img1.rectangle(bbox, outline ="red")
#         # img1.rectangle(wd_bbox, outline='green')
#         img.show()

##############################
# response = requests.post(url_track, files={'threshold': '2.0,0.5,0.5'})
# response = requests.post(url_track, files={'case_status': 'True'})
# print(response.json())

# avg_elapsed = 0
# for i,data in enumerate(payload):
#     print(type(payload[data]))
#     response = requests.post(url_wd, files={'nvr1': payload[data], 'nvr2': payload[data]})
#     avg_elapsed+=response.elapsed.total_seconds()
#     print("Avg SPFM Tracker latency: ",avg_elapsed/(i+1),'seconds')
#     response = response.json()
#     print(response)

#     img = Image.open(io.BytesIO(payload[data]))
#     print(response['tracker_results']['aggressor_ID'])
#     if len(response['tracker_results']['boxes'])>0:
#         bbox = response['tracker_results']['boxes']
#         img1 = ImageDraw.Draw(img)  
#         img1.rectangle(bbox, outline ="white")
#     # img.save('live_video/'+images[i])
#         img.show()    
