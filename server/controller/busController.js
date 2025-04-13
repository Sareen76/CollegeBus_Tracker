// controller/busController.js
import axios from "axios";

export const predictETA = async (req, res) => {
  try {
    const { lat, long, speed, timestamp } = req.body;

    const response = await axios.post('http://localhost:5001/predict', {
      lat,
      long,
      speed,
      timestamp 
    });

    return res.status(200).json({
      success: true,
      eta: response.data.eta_minutes
    });

  } catch (error) {
    console.error("Error calling ML service:", error.message);
    return res.status(500).json({
      success: false,
      message: "ML prediction failed."
    });
  }
};
