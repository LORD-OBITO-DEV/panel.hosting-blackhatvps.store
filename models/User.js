import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  pseudo: { type: String },
  email: { type: String, required: true },
  coins: { type: Number, default: 0 },
  subscription: { type: String },
  language: { type: String, default: "NodeJS" },
  adsWatched: { type: Number, default: 0 },
  adsCoins: { type: Number, default: 0 },
  googleId: { type: String }, // pour login Google
}, { timestamps: true });

export default mongoose.model("User", userSchema);
