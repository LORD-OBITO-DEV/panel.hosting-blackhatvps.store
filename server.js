import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from './passport.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ Erreur MongoDB :', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Middleware pour vérifier login
export function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/signup.html');
}

// Routes
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import panelsRoutes from './routes/panels.js';
import paymentsRoutes from './routes/payments.js';
import adsRoutes from './routes/ads.js';
import plansRoutes from './routes/plans.js';

app.use('/auth', authRoutes);
app.use('/dashboard', ensureAuth, dashboardRoutes);
app.use('/panels', ensureAuth, panelsRoutes);
app.use('/payments', ensureAuth, paymentsRoutes);
app.use('/ads', ensureAuth, adsRoutes);
app.use('/plans', ensureAuth, plansRoutes);

// Pages publiques
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/cookies', (req, res) => res.sendFile(path.join(__dirname, 'cookies.html')));
app.get('/privacy', (req, res) => res.sendFile(path.join(__dirname, 'privacy.html')));
app.get('/terms', (req, res) => res.sendFile(path.join(__dirname, 'terms.html')));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
