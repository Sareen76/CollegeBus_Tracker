import { Schema, model } from "mongoose";

const stopSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"], // Must be 'Point' for GeoJSON
      required: true,
    },
    coordinates: {
      type: [Number], // [Longitude, Latitude]
      required: true,
      validate: {
        validator: function (coords) {
          return coords.length === 2;
        },
        message: "Coordinates must have exactly two values: [longitude, latitude].",
      },
    },
  },
  address: { type: String, trim: true }, // Optional for better UI
  landmark: { type: String, trim: true }, // Optional landmark
}, { timestamps: true });

// ✅ Create a 2dsphere index for geospatial queries
stopSchema.index({ location: "2dsphere" });

// ✅ Middleware to ensure [longitude, latitude] order
stopSchema.pre("save", function (next) {
  if (this.location?.coordinates) {
    const [lon, lat] = this.location.coordinates;
    if (typeof lon !== "number" || typeof lat !== "number") {
      throw new Error("Coordinates must be numbers.");
    }
  }
  next();
});

const Stop = model("Stop", stopSchema);
export default Stop;
