from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Load the models
regression_model = joblib.load('regression_model.joblib')
classification_model = joblib.load('classification_model.joblib')
gradient_boosting_model = joblib.load('gradient_boosting_model.joblib')

def get_season(month):
    if month in [12, 1, 2]:
        return 'Winter'
    elif month in [3, 4, 5]:
        return 'Spring'
    elif month in [6, 7, 8]:
        return 'Summer'
    else:
        return 'Fall'

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    
    date = datetime.strptime(data['date'], '%Y-%m-%d')
    
    # Convert input data to DataFrame
    input_data = pd.DataFrame({
        'year': [date.year],
        'month': [date.month],
        'carrier': [data['carrier']],
        'airport': [data['origin']],  # Assuming 'airport' in the model refers to origin
        'arr_flights': [1],  # Placeholder, adjust if needed
        'arr_del15': [0],  # Placeholder, adjust if needed
        'carrier_ct': [0],  # Placeholder, adjust if needed
        'weather_ct': [0],  # Placeholder, adjust if needed
        'nas_ct': [0],  # Placeholder, adjust if needed
        'security_ct': [0],  # Placeholder, adjust if needed
        'late_aircraft_ct': [0],  # Placeholder, adjust if needed
        'season': [get_season(date.month)]  # Derive season from month
    })

    # Make predictions
    regression_pred = regression_model.predict(input_data)[0]
    classification_pred = classification_model.predict(input_data)[0]
    gradient_boosting_pred = gradient_boosting_model.predict(input_data)[0]

    return jsonify({
        'regression_prediction': float(regression_pred),
        'classification_prediction': classification_pred,
        'gradient_boosting_prediction': float(gradient_boosting_pred)
    })

if __name__ == '__main__':
    app.run(debug=True)