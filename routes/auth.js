import express from "express";
import passport from "passport";

const router = express.Router();

// Page de login (GET)
router.get("/login", (req, res) => {
  res.sendFile("login.html", { root: "./views" }); // mettre le chemin vers ton fichier login.html
});

// Traitement du login (POST)
router.post("/login", passport.authenticate("local", {
  successRedirect: "/",    // où rediriger après login réussi
  failureRedirect: "/auth/login" // où rediriger si échec
}));

// Déconnexion
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/auth/login");
  });
});

export default router;
