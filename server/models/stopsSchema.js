<<<<<<< HEAD
import { Schema, model } from 'mongoose';
=======
import { Schema, model } from "mongoose";
>>>>>>> 0dec10729552d52144b24b34afaf256d5669fbc1

const stopSchema = new Schema({
  name: {
    type: String,
    required: true,
<<<<<<< HEAD
=======
    trim: true,
>>>>>>> 0dec10729552d52144b24b34afaf256d5669fbc1
  },
  location: {
    type: {
      type: String,
<<<<<<< HEAD
      enum: ['Point'], // Must be 'Point' for GeoJSON
=======
      enum: ["Point"], // Must be 'Point' for GeoJSON
>>>>>>> 0dec10729552d52144b24b34afaf256d5669fbc1
      required: true,
    },
    coordinates: {
      type: [Number], // [Longitude, Latitude]
      required: true,
<<<<<<< HEAD
    },
  },
  landmark: {
    type: String,
  },
});

// Create a 2dsphere index for geospatial queries
stopSchema.index({ location: '2dsphere' });

const Stop = model('Stop', stopSchema);
=======
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
>>>>>>> 0dec10729552d52144b24b34afaf256d5669fbc1
export default Stop;
