import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
  cropName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'Kg' },
  pricePerQuintal: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  buyerName: { type: String, required: true, default: 'ITC e-Choupal' },
  farmerName: { type: String, required: true },
  farmerPhone: { type: String, required: true },
  paymentMethod: { type: String, required: true }, // UPI, Bank Transfer
  paymentDetails: { type: String, required: true }, // UPI ID or Account Number
  cropPhoto: { type: String }, // Base64 image payload
  status: { type: String, default: 'Pending Verification' },
  createdAt: { type: Date, default: Date.now }
});

const Deal = mongoose.model('Deal', dealSchema);
export default Deal;
