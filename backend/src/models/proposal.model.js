import mongoose from "mongoose";

/**
 * Proposal Schema
 * Stores vendor proposals in response to RFPs
 */
const proposalSchema = new mongoose.Schema({
  rfpId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RFP",
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  lineItems: [
    {
      name: String,
      qty: Number,
      unit_price: Number,
      total_price: Number,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  terms: {
    type: String,
    default: "",
  },
  warranty: {
    type: Number,
    default: 0,
  },
  rawText: {
    type: String,
    default: "",
  },
  parsedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["received", "reviewing", "accepted", "rejected"],
    default: "received",
  },
});

export default mongoose.model("Proposal", proposalSchema);
