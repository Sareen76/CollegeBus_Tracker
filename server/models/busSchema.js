import { Schema, model } from 'mongoose';

// Define the Bus Schema
const busSchema = new Schema({
  busNumber: {
    type: String,
    required: true,
    unique: true,
  },
  driverId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  routeId: {
    type: Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active',
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, 
});

// Create a 2dsphere index for geospatial queries
busSchema.index({ currentLocation: '2dsphere' });

// Pre-save hook to auto-update `lastUpdated`
busSchema.pre('save', function (next) {
  this.lastUpdated = Date.now();
  next();
});

// Export the model
const Bus = model('Bus', busSchema);
export default Bus;
