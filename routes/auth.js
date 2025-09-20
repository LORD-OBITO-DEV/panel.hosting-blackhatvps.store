import express from "express";
import passport from "passport";
const router = express.Router();

// Connexion Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback Google
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// Déconnexion
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

export default router;
