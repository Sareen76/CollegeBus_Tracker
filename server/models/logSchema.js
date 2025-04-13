import { Schema, model } from 'mongoose';

const logSchema = new Schema({
  eventType: {
    type: String,
    enum: ['location_update', 'status_change', 'error', 'info', 'warning'],
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  relatedId: {
    type: Schema.Types.ObjectId,
    refPath: 'relatedModel',
  },
  relatedModel: {
    type: String,
    enum: ['Bus', 'User', 'Trip', 'Route'], // Dynamic reference for flexibility
  },
  metadata: {
    type: Schema.Types.Mixed, // Store additional flexible data (like location)
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Log = model('Log', logSchema);
export default Log;
