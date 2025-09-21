// routes/plans.js
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Route pour afficher les plans et les points de l'utilisateur
router.get('/', async (req, res) => {
  try {
    const user = req.user; // récupéré par passport.js
    if (!user) return res.redirect('/login');

    // Exemple de plans (tu peux modifier les prix ou points)
    const plans = [
      { name: "100 Points", points: 100, price: 1 },
      { name: "200 Points", points: 200, price: 2 },
      { name: "300 Points", points: 300, price: 2.5 },
      { name: "400 Points", points: 400, price: 4 },
      { name: "500 Points", points: 500, price: 5 }
    ];

    res.render('plans', { userPoints: user.points, plans });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});

export default router;
