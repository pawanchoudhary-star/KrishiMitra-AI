import mongoose from 'mongoose';

const soilHealthSchema = new mongoose.Schema({
  farmerPhone: { type: String, required: true },
  soilType: { type: String, required: true }, // Clayey, Sandy, Loamy, Black, Red
  waterLevel: { type: String, required: true }, // Low, Medium, High
  season: { type: String, required: true }, // Rabi, Kharif, Zaid
  recommendation: { type: String, required: true }, // AI response payload
  createdAt: { type: Date, default: Date.now }
});

const SoilHealth = mongoose.model('SoilHealth', soilHealthSchema);
export default SoilHealth;
