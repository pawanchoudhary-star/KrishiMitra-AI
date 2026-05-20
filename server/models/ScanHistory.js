import mongoose from 'mongoose';

const scanHistorySchema = new mongoose.Schema({
  farmerPhone: { type: String, required: true },
  cropPhoto: { type: String, required: true }, // base64 string or image URL
  cropName: { type: String, default: 'Unknown Crop' }, // crop identified (e.g. Wheat, Mustard, Tomato)
  diseaseName: { type: String, required: true }, // e.g. Wheat Rust, Late Blight, Healthy Crop
  remedy: { type: String, required: true }, // Markdown remedy guidance from AI
  createdAt: { type: Date, default: Date.now }
});

const ScanHistory = mongoose.model('ScanHistory', scanHistorySchema);
export default ScanHistory;
