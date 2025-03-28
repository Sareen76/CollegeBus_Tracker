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
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'inactive',
  },
}, { timestamps: true });

const Bus = model('Bus', busSchema);
export default Bus;
