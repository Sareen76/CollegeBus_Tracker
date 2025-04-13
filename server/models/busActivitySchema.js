// Define the Bus Activity Schema
const busActivitySchema = new Schema({
    busId: {
      type: Schema.Types.ObjectId,
      ref: 'Bus',
      required: true,
    },
    currentLocation: {
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
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  }, { timestamps: true });
  
  // Create a 2dsphere index for geospatial queries
  busActivitySchema.index({ currentLocation: '2dsphere' });
  
  // Pre-save hook to auto-update `lastUpdated`
  busActivitySchema.pre('save', function (next) {
    this.lastUpdated = Date.now();
    next();
  });
  
  const BusActivity = model('BusActivity', busActivitySchema);
  export default BusActivity;
  