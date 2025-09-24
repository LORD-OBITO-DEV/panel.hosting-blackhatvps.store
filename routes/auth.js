import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js"; // Ton modèle utilisateur
import passport from "passport";

const router = express.Router();

// Page d'inscription (GET)
router.get("/signup", (req, res) => {
  res.sendFile("signup.html", { root: "./views" }); // chemin vers ton fichier signup.html
});

// Traitement de l'inscription (POST)
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.redirect("/auth/signup"); // tu peux ajouter un message d'erreur

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Rediriger vers login après inscription
    res.redirect("/auth/login");
  } catch (err) {
    console.error(err);
    res.redirect("/auth/signup");
  }
});

export default router;
