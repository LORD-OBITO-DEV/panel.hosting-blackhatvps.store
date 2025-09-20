import express from 'express';
import fetch from 'node-fetch';
import { ensureAuth } from '../middlewares/auth.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/buy', ensureAuth, async (req, res) => {
  const { panelName, panelLang, panelSize } = req.body;
  const user = req.user;

  // Prix en points selon la taille
  const panelPrices = {
    '1': 20,
    '2': 40,
    '5': 90,
    '10': 150,
    'illimite': 150
  };
  const pointsNeeded = panelPrices[panelSize];

  if (user.points < pointsNeeded) {
    return res.json({ success: false, message: 'Vous n’avez pas assez de points.' });
  }

  // Génère le nom du panel si vide
  const name = panelName || user.name;

  // Payload Pterodactyl
  const pad = Math.floor(Math.random() * 10000);
  const payload = {
    name: name,
    description: "Panel public auto-créé",
    location_id: 1,
    fqdn: `panel${pad}.blackhatvps.store`,
    scheme: "https",
    memory: panelSize === 'illimite' ? 0 : parseInt(panelSize) * 1024,
    memory_overallocate: 0,
    disk: panelSize === 'illimite' ? 0 : parseInt(panelSize) * 20000,
    disk_overallocate: 0,
    daemon_base: "/var/lib/pterodactyl/volumes",
    daemon_sftp: 2022 + pad,
    daemon_listen: 8080 + pad
  };

  try {
    const r = await fetch(`${process.env.PTERO_API_URL}/api/application/nodes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PTERO_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const result = await r.json();

    // Retire les points de l'utilisateur
    user.points -= pointsNeeded;
    user.panels.push({ name: payload.name, fqdn: payload.fqdn, lang: panelLang });
    await user.save();

    return res.json({ success: true, panelUrl: `https://${payload.fqdn}` });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: 'Impossible de créer le panel.' });
  }
});

export default router;
