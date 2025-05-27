from flask import Flask, request, render_template, jsonify
import requests
from datetime import datetime 
import io
import shutil
from PIL import Image
from utils import get_post_endpoint, img_processing, send_data
import os


app = Flask(__name__)

DB_PATH = "db/"
UPLAOD_DIR = "UPLOAD_DIR/"

os.makedirs(DB_PATH, exist_ok=True)



@app.route("/processing", methods=["POST"])
def get_image(): 

    if request.method == "POST":

        
        if 'imageFile' not in request.files:
            return jsonify({"error": "No imageFile part"}), 400

        file = request.files['imageFile']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        shutil.rmtree(UPLAOD_DIR, ignore_errors=True)
        os.makedirs(UPLAOD_DIR, exist_ok=True)

        img_path = os.path.join(UPLAOD_DIR, "esp32-cam.jpg")
        file.save(img_path)


        student_id = img_processing(img_path=img_path, db_path=DB_PATH, model_name="Facenet")
        if student_id is not None:
            resp = requests.post(get_post_endpoint(student_id))
            if  resp.ok:
                return jsonify({"present": True})
         
        return jsonify({"present": False})


    return "request method not supported"


@app.route("/add_toDB", methods=["POST"])
def add_toDB(): 
    if request.method == "POST": 
        data = request.get_json()
        studentID = data["studentId"]
        filename = os.path.join(DB_PATH, studentID)
        resp = requests.get(data["pictureUrl"], stream=True)
        
        image = Image.open(io.BytesIO(resp.content))
        image.save(filename + ".jpg", "JPEG")

    

if __name__ == "__main__": 
    app.run(debug=True)