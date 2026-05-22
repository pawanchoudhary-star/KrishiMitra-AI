import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
  cropName: { type: String, required: true },
  sowingDate: { type: Date, required: true },
  area: { type: Number, required: true }, // in acres
  healthStatus: { type: String, default: 'Healthy' }, // Healthy, Monitored, Disease Alert
  farmerPhone: { type: String, required: true }, // tied to the farmer's account
  createdAt: { type: Date, default: Date.now }
});

const Crop = mongoose.model('Crop', cropSchema);
export default Crop;