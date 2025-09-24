import express from "express";
import passport from "passport";
import User from "../models/User.js"; // ton modèle utilisateur
import bcrypt from "bcryptjs";

const router = express.Router();

// Page login (GET)
router.get("/login", (req, res) => {
  res.sendFile("login.html", { root: "./views/auth" }); // ton login.html
});

// Page signup (GET)
router.get("/signup", (req, res) => {
  res.sendFile("signup.html", { root: "./views/auth" }); // ton signup.html
});

// Signup (POST)
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.redirect("/auth/login");
  } catch (err) {
    res.status(500).send("Erreur lors de l'inscription");
  }
});

// Login (POST)
router.post("/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureFlash: false
  })
);

export default router;
