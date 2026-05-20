import mongoose from 'mongoose';

const sosAlertSchema = new mongoose.Schema({
  farmerName: { type: String, required: true },
  farmerPhone: { type: String, required: true },
  locationName: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  status: { type: String, default: 'Active' }, // Active, Resolved
  createdAt: { type: Date, default: Date.now }
});

const SosAlert = mongoose.model('SosAlert', sosAlertSchema);
export default SosAlert;
