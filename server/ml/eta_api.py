from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
import pickle
from datetime import datetime
import numpy as np
import os

app = Flask(__name__)

# MongoDB Setup
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://sareengarnaik51:simran1234@blog-app.0pezqyz.mongodb.net/Bus_Tracker")
client = MongoClient(MONGO_URI)
db = client["Bus_Tracker"]  # replace with your DB name
gps_logs = db["gpslogs"]  # collection name (usually auto-lowercase from schema)

# Load the trained ETA model
with open("model/eta_model.pkl", "rb") as f:
    model = pickle.load(f)

@app.route("/predict", methods=["POST"])
def predict_eta():
    data = request.json
    bus_id = data.get("busId")

    if not bus_id:
        return jsonify({"error": "busId is required"}), 400

    # Fetch latest GPS log for this bus
    latest_log = gps_logs.find_one(
        {"busId": ObjectId(bus_id)},
        sort=[("timestamp", -1)]
    )

    if not latest_log:
        return jsonify({"error": "No GPS log found for this bus"}), 404

    # Extract data from log
    lat = latest_log["location"]["coordinates"][1]
    long = latest_log["location"]["coordinates"][0]
    speed = latest_log.get("speed", 30)  # fallback if speed is not set
    timestamp = latest_log["timestamp"]

    # Prepare features for the model
    hour = timestamp.hour
    weekday = timestamp.weekday()
    features = np.array([[lat, long, speed, hour, weekday]])

    # Predict ETA
    eta = model.predict(features)[0]

    return jsonify({
        "busId": str(bus_id),
        "eta_minutes": round(eta, 2),
        "predicted_at": datetime.utcnow().isoformat() + "Z"
    })

if __name__ == "__main__":
    app.run(debug=True, port=5001)

