import { Schema, model } from 'mongoose';

const tripSchema = new Schema({
  busId: {
    type: Schema.Types.ObjectId,
    ref: 'Bus',
    required: true,
  },
  driverId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming drivers are in the User model
    required: true,
  },
  routeId: {
    type: Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'cancelled'],
    default: 'ongoing',
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], // [Longitude, Latitude]
      required: true,
    },
  },
  history: [
    {
      timestamp: {
        type: Date,
        required: true,
      },
      location: {
        type: [Number], // [Longitude, Latitude]
        required: true,
      },
    },
  ],
}, { timestamps: true });

// Geospatial index for current location and history
tripSchema.index({ currentLocation: '2dsphere' });
tripSchema.index({ 'history.location': '2dsphere' });

const Trip = model('Trip', tripSchema);
export default Trip;
