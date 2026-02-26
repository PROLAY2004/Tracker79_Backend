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
      type: Number,
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

    type: {
      type: String,
      required: true,
      enum: ['buy', 'sell'],
      default: 'buy',
    },
  },
  {
    timestamps: true,
  }
);

const records = mongoose.model('record', recordSchema);
export default records;
