from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
import os
from download_models import download_all_models

download_all_models()

app = Flask(__name__)
CORS(app, resources={r"/*": {
    "origins": ["https://flight-delay-predictor.vercel.app", "http://localhost:3000"],
    "methods": ["GET", "POST", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
}})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'https://flight-delay-predictor.vercel.app')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

# Load the models
regression_model = joblib.load('regression_model.joblib')
classification_model = joblib.load('classification_model.joblib')
gradient_boosting_model = joblib.load('gradient_boosting_model.joblib')
kmeans_model = joblib.load('kmeans_model.joblib')
preprocessor = joblib.load('preprocessor.joblib')

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