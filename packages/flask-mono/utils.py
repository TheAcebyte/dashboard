import os 
import glob
import requests
from deepface import DeepFace
import json
from typing import Optional
import os
from deepface import DeepFace



def get_post_endpoint(studentId):
    return f"http://192.168.1.150:3000/api/students/{studentId}/session"


def cache_embeddings(db_path: str = "db", model_name: str = "Facenet"):
    embedding_list = DeepFace.represent(img_path=db_path, model_name=model_name)
    with open(os.path.join(db_path, "embeddings.json"), "w") as f:
        json.dump(embedding_list, f)

def load_embeddings(embeddings_json_path: str = "db/embeddings.json"):
    with open(embeddings_json_path, "r") as f:
        embeddings = json.load(f)
    return embeddings

def send_data(payload: dict[str: bool] | None, url: str) -> None: 
    requests.post(url, json=payload)


def img_processing(img_path: os.path, db_path: str | os.PathLike, model_name: str = "Facenet") -> Optional[str]:
    '''I have to find a way to connect the model with the db,
    and get the student ID from the results.
    '''
    results = DeepFace.find(img_path, db_path, model_name)
    studentID = os.path.basename(results[0]['identity'][0])[:-4]
    if studentID:
        return studentID
    else:
        return None