import { Schema, model } from 'mongoose';

// Define the Route Schema
const routeSchema = new Schema({
  routeName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  source: {
    type: String,
    required: true,
    trim: true,
  },
  destination: {
    type: String,
    required: true,
    trim: true,
  },
  stops: [
    {
      stopId: {
        type: Schema.Types.ObjectId,
        ref: 'Stop',
        required: true,
      },
      order: {
        type: Number,
        required: true,
      },
    },
  ],
  totalDistance: {
    type: String,
    required: true,
  },
  estimatedTime: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,  // Automatically adds createdAt and updatedAt fields
  versionKey: false, // Disables the __v version field
});

// Create an index for efficient route searching
routeSchema.index({ routeName: 1, source: 1, destination: 1 }, { unique: true });

const Route = model('Route', routeSchema);
export default Route;
