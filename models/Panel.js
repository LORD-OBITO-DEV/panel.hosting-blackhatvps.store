import mongoose from 'mongoose';

const PanelSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  size: { type: String, required: true }, // 1Go, 2Go, Illimité
  language: { type: String, default: 'Node.js' },
  pointsUsed: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date } // pour les panels limités
});

export default mongoose.model('Panel', PanelSchema);
