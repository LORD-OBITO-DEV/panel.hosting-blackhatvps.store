import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import panelsRoutes from './routes/panels.js';
import paymentsRoutes from './routes/payments.js';
import adsRoutes from './routes/ads.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Passport Google OAuth
app.use(passport.initialize());
app.use(passport.session());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/panels', panelsRoutes);
app.use('/payments', paymentsRoutes);
app.use('/ads', adsRoutes);

// Route d'accueil
app.get('/', (req, res) => {
  res.send('Bienvenue sur BlackHatVPS Panel!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
