import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: ['signup', 'reset'],
    },
  },
  {
    timestamps: true,
  }
);

const otp = mongoose.model('userOtp', otpSchema);
export default otp;
