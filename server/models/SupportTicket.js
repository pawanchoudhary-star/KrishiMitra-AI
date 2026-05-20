import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  farmerName: { type: String, required: true },
  farmerPhone: { type: String, required: true },
  category: { type: String, required: true }, // Weather, Mandi Prices, Seed Suggestion, Crop Disease, Other
  description: { type: String, required: true },
  status: { type: String, default: 'Open' }, // Open, In Progress, Resolved
  createdAt: { type: Date, default: Date.now }
});

const SupportTicket = mongoose.model('SupportTicket', ticketSchema);
export default SupportTicket;
