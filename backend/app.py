from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
import io
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization"]}})

# Function to load model from Google Drive
def load_model_from_drive(file_id):
    creds = Credentials.from_authorized_user_file('token.json', ['https://www.googleapis.com/auth/drive.readonly'])
    drive_service = build('drive', 'v3', credentials=creds)
    
    request = drive_service.files().get_media(fileId=file_id)
    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fh, request)
    done = False
    while done is False:
        status, done = downloader.next_chunk()
    fh.seek(0)
    return joblib.load(fh)

# Load the models (replace with your Google Drive file IDs)
regression_model = load_model_from_drive('your_regression_model_file_id')
classification_model = load_model_from_drive('your_classification_model_file_id')
gradient_boosting_model = load_model_from_drive('your_gradient_boosting_model_file_id')
kmeans_model = load_model_from_drive('your_kmeans_model_file_id')
preprocessor = load_model_from_drive('your_preprocessor_file_id')

def get_season(month):
    if month in [12, 1, 2]:
        return 'Winter'
    elif month in [3, 4, 5]:
        return 'Spring'
    elif month in [6, 7, 8]:
        return 'Summer'
    else:
        return 'Fall'

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    
    date = datetime.strptime(data['date'], '%Y-%m-%d')
    
    # Convert input data to DataFrame
    input_data = pd.DataFrame({
        'year': [date.year],
        'month': [date.month],
        'carrier': [data['carrier']],
        'airport': [data['origin']],
        'arr_flights': [1],
        'arr_del15': [0],
        'carrier_ct': [0],
        'weather_ct': [0],
        'nas_ct': [0],
        'security_ct': [0],
        'late_aircraft_ct': [0],
        'season': [get_season(date.month)]
    })

    # Make predictions
    regression_pred = regression_model.predict(input_data)[0]
    classification_pred = classification_model.predict(input_data)[0]
    gradient_boosting_pred = gradient_boosting_model.predict(input_data)[0]

    # Perform clustering
    X_transformed = preprocessor.transform(input_data)
    cluster = kmeans_model.predict(X_transformed)[0]

    return jsonify({
        'regression_prediction': float(regression_pred),
        'classification_prediction': int(classification_pred),
        'gradient_boosting_prediction': float(gradient_boosting_pred),
        'cluster': int(cluster)
    })

if __name__ == '__main__':
    app.run(debug=True)