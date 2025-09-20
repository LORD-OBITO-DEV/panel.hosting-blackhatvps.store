import express from "express";
import { ensureAuth } from "../middlewares/auth.js";
import Panel from "../models/Panel.js";
import User from "../models/User.js";

const router = express.Router();

// Route dashboard
router.get("/", ensureAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const panels = await Panel.find({ owner: userId });

    res.render("dashboard", {
      user,
      panels,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});

export default router;
