import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["panel", "coins"], required: true },
  item: { type: String }, // nom du panel ou plan de coins
  amount: { type: Number, required: true }, // montant payé en € ou nombre de coins
  points: { type: Number, default: 0 }, // points achetés ou reçus
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Transaction", transactionSchema);
