import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import passport from "passport";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import panelsRoutes from "./routes/panels.js";
import paymentsRoutes from "./routes/payments.js";
import plansRoutes from "./routes/plans.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Passport
import "./config/passport.js";
app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use("/public", express.static(path.join(__dirname, "public")));

// --- Routes publiques ---
app.use("/auth", authRoutes);

// Middleware pour protéger les routes privées
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/login");
}

// Routes protégées
app.use("/dashboard", ensureAuthenticated, dashboardRoutes);
app.use("/panels", ensureAuthenticated, panelsRoutes);
app.use("/payments", ensureAuthenticated, paymentsRoutes);
app.use("/plans", ensureAuthenticated, plansRoutes);

// Pages légales
app.get("/privacy", (req, res) => res.sendFile(path.join(__dirname, "privacy.html")));
app.get("/terms", (req, res) => res.sendFile(path.join(__dirname, "terms.html")));
app.get("/cookies", (req, res) => res.sendFile(path.join(__dirname, "cookies.html")));

// Page d'accueil publique
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
