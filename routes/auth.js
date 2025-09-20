import express from 'express';
import passport from 'passport';
import User from '../models/User.js';

const router = express.Router();

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/signup.html' }),
  async (req, res) => {
    try {
      // Si l'utilisateur n'existe pas, on le crée
      let user = await User.findOne({ googleId: req.user.id });
      if (!user) {
        user = new User({
          googleId: req.user.id,
          name: req.user.displayName,
          email: req.user.emails[0].value,
          points: 0,
          panels: []
        });
        await user.save();
      }
      res.redirect('/dashboard.html');
    } catch (err) {
      console.error(err);
      res.redirect('/signup.html');
    }
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) console.error(err);
    res.redirect('/');
  });
});

export default router;
