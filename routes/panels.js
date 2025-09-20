import express from 'express';
import User from '../models/User.js';
import Panel from '../models/Panel.js';
import { ensureAuth } from '../utils/authMiddleware.js';
import axios from 'axios';

const router = express.Router();

// Créer un panel
router.post('/create', ensureAuth, async (req, res) => {
  try {
    const { name, size, language } = req.body;
    const user = await User.findById(req.user._id);

    // Définir nom par défaut si non fourni
    const panelName = name || user.username;

    // Déterminer points nécessaires selon taille
    let pointsNeeded = 0;
    switch(size){
      case '1Go': pointsNeeded = 15; break;
      case '2Go': pointsNeeded = 30; break;
      case '5Go': pointsNeeded = 60; break;
      case '10Go': pointsNeeded = 100; break;
      case 'illimité': pointsNeeded = 150; break;
      default: return res.status(400).json({ error: 'Taille invalide' });
    }

    if(user.points < pointsNeeded){
      return res.status(400).json({ error: 'Points insuffisants' });
    }

    // Déduire points
    user.points -= pointsNeeded;
    await user.save();

    // Créer panel via Pterodactyl API
    const payload = {
      name: panelName,
      user: process.env.PTERO_ADMIN_USER, // user unique sur Pterodactyl
      size,
      language
    };

    const response = await axios.post(`${process.env.PTERO_API_URL}/api/application/panels`, payload, {
      headers: { Authorization: `Bearer ${process.env.PTERO_API_KEY}` }
    });

    // Enregistrer dans MongoDB
    const panel = new Panel({
      owner: user._id,
      name: panelName,
      size,
      language,
      pointsUsed: pointsNeeded
    });
    await panel.save();

    user.panels.push(panel._id);
    await user.save();

    res.json({ success: true, panel });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur lors de la création du panel' });
  }
});

export default router;
