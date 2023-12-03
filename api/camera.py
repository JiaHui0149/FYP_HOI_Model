import cv2,os,urllib.request
import numpy as np


class IPWebCam(object):
    def __init__(self):
        self.frame_num = 0
        # self.url = "http://10.156.123.109:8080/shot.jpg"
        self.url = "http://192.168.1.106:8080/shot.jpg"
        
    def __del__(self):
        cv2.destroyAllWindows()

    def get_frame(self):
        self.frame_num += 1
        imgResp = urllib.request.urlopen(self.url)
        imgNp = np.array(bytearray(imgResp.read()),dtype=np.uint8)
        return imgNp
        # img= cv2.imdecode(imgNp,-1)
        # resize = cv2.resize(img, (640, 480), interpolation = cv2.INTER_LINEAR) 
        # frame_flip = cv2.flip(resize,1)
        # ret, jpeg = cv2.imencode('.jpg', frame_flip)
        # return jpeg.tobytes()
        

