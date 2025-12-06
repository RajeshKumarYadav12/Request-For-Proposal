import mongoose from 'mongoose';

/**
 * Vendor Schema
 * Stores vendor contact information and notes
 */
const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  contact_email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  contact_person: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Vendor', vendorSchema);
