import express from 'express';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { ensureAuth } from '../utils/authMiddleware.js';

const router = express.Router();

// Acheter pack de points
router.post('/buy-points', ensureAuth, async (req, res) => {
  const { pack } = req.body; // ex: 100, 200, 300, 400, 500
  const priceMap = { 100:1, 200:2, 300:2.5, 400:4, 500:5 };
  const pointsMap = { 100:100, 200:200, 300:300, 400:400, 500:500 };

  if(!priceMap[pack]) return res.status(400).json({ error: 'Pack invalide' });

  // Ici intégrer PayPal ou Paysky, puis valider paiement
  const user = await User.findById(req.user._id);
  user.points += pointsMap[pack];
  await user.save();

  const transaction = new Transaction({
    user: user._id,
    type: 'pack',
    points: pointsMap[pack],
    amount: priceMap[pack],
    status: 'completed'
  });
  await transaction.save();

  res.json({ success: true, points: user.points });
});

// Abonnement hebdo (200p/semaine → 8.99€/mois)
router.post('/subscribe-weekly', ensureAuth, async (req, res) => {
  const user = await User.findById(req.user._id);
  // Intégrer paiement mensuel ici (PayPal / Paysky)
  const transaction = new Transaction({
    user: user._id,
    type: 'subscription',
    points: 200,
    amount: 8.99,
    status: 'completed'
  });
  await transaction.save();
  res.json({ success: true, message: 'Abonnement activé, 200 points par semaine' });
});

export default router;
