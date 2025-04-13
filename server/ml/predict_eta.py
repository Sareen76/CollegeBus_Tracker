import pickle
import numpy as np
from datetime import datetime 

# Load trained model
with open("model/eta_model.pkl", "rb") as f:
    model = pickle.load(f)

def predict_eta(lat, long, speed, timestamp):
    dt = datetime.fromisoformat(timestamp)  # assumes ISO format e.g., '2025-04-10T15:45:00'
    features = np.array([[lat, long, speed, dt.hour, dt.weekday()]])
    eta = model.predict(features)[0]
    return round(eta, 2)

