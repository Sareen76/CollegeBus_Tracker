import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import pickle
from datetime import datetime

# Load GPS logs
df = pd.read_csv("data/gps_logs.csv")

# Feature engineering
df['timestamp'] = pd.to_datetime(df['timestamp'])
df['hour'] = df['timestamp'].dt.hour
df['day_of_week'] = df['timestamp'].dt.dayofweek

# Features and target
features = ['lat', 'long', 'speed', 'hour', 'day_of_week']
target = 'eta_minutes'

X = df[features]
y = df[target]

# Train model
model = RandomForestRegressor()
model.fit(X, y)

# Save model
with open("model/eta_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ ETA model trained and saved.")
