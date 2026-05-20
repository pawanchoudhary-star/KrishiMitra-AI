import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleHindi: { type: String, required: true },
  description: { type: String, required: true },
  descriptionHindi: { type: String, required: true },
  benefits: { type: String, required: true }, // e.g., "₹6,000 per year directly to bank account"
  benefitsHindi: { type: String, required: true },
  category: { type: String, required: true }, // e.g., Financial, Insurance, Irrigation, Machinery
  categoryHindi: { type: String, required: true },
  minLandAcres: { type: Number, default: 0 },
  maxLandAcres: { type: Number, default: 999 },
  eligibleCrops: { type: [String], default: [] }, // Empty means all crops eligible
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Scheme = mongoose.model('Scheme', schemeSchema);
export default Scheme;
