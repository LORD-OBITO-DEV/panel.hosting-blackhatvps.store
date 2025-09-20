import express from 'express';
import User from '../models/User.js';
import { ensureAuth } from '../utils/authMiddleware.js';

const router = express.Router();

// Créditer points après pub
router.post('/watch', ensureAuth, async (req, res) => {
  const user = await User.findById(req.user._id);
  user.points += 2; // chaque pub vue = 2 points
  await user.save();
  res.json({ success: true, points: user.points });
});

export default router;
