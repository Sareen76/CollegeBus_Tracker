import { Schema, model } from 'mongoose';

const stopSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], // Must be 'Point' for GeoJSON
      required: true,
    },
    coordinates: {
      type: [Number], // [Longitude, Latitude]
      required: true,
    },
  },
  landmark: {
    type: String,
  },
});

// Create a 2dsphere index for geospatial queries
stopSchema.index({ location: '2dsphere' });

const Stop = model('Stop', stopSchema);
export default Stop;
