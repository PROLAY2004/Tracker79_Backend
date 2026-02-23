import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },

    investment: {
      type: Number,
      required: true,
    },

    tax: {
      type: Number,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },

    gold: {
      type: String,
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },

    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const records = mongoose.model('record', recordSchema);
export default records;
