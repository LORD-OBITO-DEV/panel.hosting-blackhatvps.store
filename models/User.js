import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  googleId: { type: String },
  points: { type: Number, default: 0 },
  panels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Panel' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);
