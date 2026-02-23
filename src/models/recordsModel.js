import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema(
  {
    date: {
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

const records = mongoose.model('record', recordSchema);
export default records;
