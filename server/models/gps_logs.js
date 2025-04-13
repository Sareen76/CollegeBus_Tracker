import { Schema, model } from 'mongoose';

const gpsLogSchema = new Schema({
  busId: {
    type: Schema.Types.ObjectId,
    ref: 'Bus',
    required: true,
  },
  routeId: {
    type: Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
  },
  tripId: {
    type: Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
  },
  driverId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  speed: {
    type: Number, // in km/h or m/s based on your frontend device
    required: false,
  },
  heading: {
    type: Number, // direction in degrees (optional)
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
}, {
  timestamps: true,
  versionKey: false,
});

// Geospatial index for querying location
gpsLogSchema.index({ location: '2dsphere' });
// Optional: index for timestamp sorting and lookup
gpsLogSchema.index({ busId: 1, timestamp: -1 });

const GpsLog = model('GpsLog', gpsLogSchema);
export default GpsLog;
