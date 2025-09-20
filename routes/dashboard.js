import express from 'express';
import User from '../models/User.js';
import Panel from '../models/Panel.js';
import { ensureAuth } from '../utils/authMiddleware.js';

const router = express.Router();

// Dashboard principal
router.get('/', ensureAuth, async (req, res) => {
  const user = await User.findById(req.user._id).populate('panels');
  res.json({
    username: user.username,
    points: user.points,
    panels: user.panels
  });
});

export default router;
