import express from "express";
import fetch from "node-fetch";
import { ensureAuth } from "../middlewares/auth.js";

const router = express.Router();

// Créer un panel via l’API Pterodactyl
router.post("/create", ensureAuth, async (req, res) => {
  const { planId } = req.body;

  try {
    // Ex: charger le plan depuis DB (stockage, CPU, RAM)
    // ici exemple simplifié :
    const plans = {
      "basic": { cpu: 50, ram: 1024, disk: 5000 },
      "pro": { cpu: 100, ram: 2048, disk: 10000 },
      "ultra": { cpu: 200, ram: 4096, disk: 20000 }
    };

    const plan = plans[planId];
    if (!plan) return res.json({ success: false, message: "Plan invalide" });

    const response = await fetch(`${process.env.PTERO_API_URL}/api/application/servers`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PTERO_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        name: `${req.user.name}-panel`,
        user: req.user.pteroId || 1,
        egg: 5, // ex: NodeJS egg
        docker_image: "ghcr.io/pterodactyl/yolks:nodejs_18",
        startup: "npm start",
        environment: {},
        limits: {
          memory: plan.ram,
          swap: 0,
          disk: plan.disk,
          io: 500,
          cpu: plan.cpu,
        },
        feature_limits: {
          databases: 1,
          backups: 1,
          allocations: 1,
        },
        allocation: {
          default: 1,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return res.json({ success: false, message: err });
    }

    const server = await response.json();
    return res.json({ success: true, server });
  } catch (err) {
    console.error("Erreur création panel :", err);
    res.json({ success: false, message: "Erreur serveur" });
  }
});

export default router;
