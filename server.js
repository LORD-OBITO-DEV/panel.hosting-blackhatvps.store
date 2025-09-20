import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
import "./config/passport.js"; // stratégie Google OAuth

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Middlewares ===
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// === Sessions ===
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard_cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

// === Passport ===
app.use(passport.initialize());
app.use(passport.session());

// === Static files ===
app.use(express.static(path.join(__dirname, "public")));

// === View engine ===
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// === MongoDB Connection ===
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.error("❌ MongoDB erreur:", err));

// === Routes ===
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import panelRoutes from "./routes/panels.js";
import pointsRoutes from "./routes/points.js";
import adsRoutes from "./routes/ads.js";
import paymentRoutes from "./routes/payments.js";

app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/panels", panelRoutes);
app.use("/points", pointsRoutes);
app.use("/pubs", adsRoutes);
app.use("/payment", paymentRoutes);

// === Home page ===
app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  } else {
    res.render("home", { user: req.user });
  }
});

// === Error page ===
app.use((req, res) => {
  res.status(404).render("errors/404", { user: req.user });
});

// === Start server ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
