import mongoose from 'mongoose';

const cropTaskSchema = new mongoose.Schema({
  farmerPhone: { type: String, required: true },
  cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
  cropName: { type: String, required: true },
  taskName: { type: String, required: true },
  taskHindi: { type: String, required: true },
  description: { type: String, required: true },
  descriptionHindi: { type: String, required: true },
  dayNumber: { type: Number, required: true }, // e.g., Day 1, 21, 45, 60
  category: { type: String, required: true }, // Irrigation, Fertilizer, Pesticide, Weeding, Harvesting
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const CropTask = mongoose.model('CropTask', cropTaskSchema);
export default CropTask;
