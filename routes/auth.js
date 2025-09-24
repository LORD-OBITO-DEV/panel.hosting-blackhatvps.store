// Import des modules principaux
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import passport from "passport";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Import des routes
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import panelsRoutes from "./routes/panels.js";
import paymentsRoutes from "./routes/payments.js";
import plansRoutes from "./routes/plans.js";

// Configuration des variables d'environnement
dotenv.config();

// Pour pouvoir utiliser __dirname en ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Création de l'app Express
const app = express();

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

// Middlewares pour parser le body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Express
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Passport
import "./config/passport.js"; // configure passport-local
app.use(passport.initialize());
app.use(passport.session());

// Fichiers statiques
app.use("/public", express.static(path.join(__dirname, "public")));
