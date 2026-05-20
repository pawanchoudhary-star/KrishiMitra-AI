import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Plaid text or hashed password
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
export default User;
