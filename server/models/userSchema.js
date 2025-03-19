import { Schema, model } from 'mongoose';
import { hash, compare } from 'bcrypt';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Either enter Sic or email later check in controller
    identity: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'driver'],
      default: 'user',
    },
    password: {
      type: String,
      required: true,
      select: false, // Exclude password by default
    },
    phone: {
      type: String,
      required: true,
      match: /^[6-9]\d{9}$/,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index (Optional but useful for combined queries)
userSchema.index({ email: 1, role: 1 });

// Pre-save hook to hash password - a mongoose middlewire
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await hash(this.password, 10);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await compare(candidatePassword, this.password);
};

const User = model('User', userSchema);
export default User;
