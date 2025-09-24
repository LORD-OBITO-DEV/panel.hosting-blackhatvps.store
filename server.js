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

// Middleware pour protéger les routes
import { ensureAuth } from "./middleware/ensureAuth.js";

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

// ---------------------
// Routes publiques
// ---------------------

// Home page publique
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Legal pages
app.get("/privacy", (req, res) => res.sendFile(path.join(__dirname, "privacy.html")));
app.get("/terms", (req, res) => res.sendFile(path.join(__dirname, "terms.html")));
app.get("/cookies", (req, res) => res.sendFile(path.join(__dirname, "cookies.html")));

// Auth routes (login / signup)
app.use("/auth", authRoutes);

// ---------------------
// Routes protégées (login requis)
// ---------------------
app.use("/dashboard", ensureAuth, dashboardRoutes);
app.use("/panels", ensureAuth, panelsRoutes);
app.use("/payments", ensureAuth, paymentsRoutes);
app.use("/plans", ensureAuth, plansRoutes);

// ---------------------
// Start server
// ---------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
