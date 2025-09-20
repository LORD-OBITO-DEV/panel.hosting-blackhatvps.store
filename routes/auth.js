import express from 'express';
import passport from 'passport';
import User from '../models/User.js';

const router = express.Router();

// Login page
router.get('/login', (req, res) => {
  res.send('Page de login'); // plus tard remplacer par login.html
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  (req, res) => {
    // Successful login
    res.redirect('/dashboard');
  }
);

export default router;
