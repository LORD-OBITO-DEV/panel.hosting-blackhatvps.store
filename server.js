import express from 'express';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './auth.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);

// Dashboard route
app.get('/dashboard', (req, res) => {
  if(!req.user) return res.redirect('/login');
  res.send(`Bienvenue ${req.user.username}, vous avez ${req.user.points} points.`);
});

app.listen(process.env.PORT || 3000, () => console.log(`Server running on port ${process.env.PORT}`));
