import mongoose from "mongoose";

const rfpSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    default: null,
  },
  items: [
    {
      name: {
        type: String,
        required: true,
      },
      qty: {
        type: Number,
        required: true,
      },
      specs: {
        type: String,
        default: "",
      },
    },
  ],
  delivery_deadline: {
    type: Date,
    default: null,
  },
  payment_terms: {
    type: String,
    default: "Net 30",
  },
  status: {
    type: String,
    enum: ["draft", "sent", "evaluating", "awarded", "cancelled"],
    default: "draft",
  },
  sentTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

rfpSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("RFP", rfpSchema);
