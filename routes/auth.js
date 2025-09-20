import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { getDB } from './db.js';

dotenv.config();

const router = express.Router();
const db = getDB();

// Configuration Passport
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Chercher l'utilisateur dans la DB
    let user = await db.collection('users').findOne({ googleId: profile.id });

    if (!user) {
      // Création nouveau user
      const result = await db.collection('users').insertOne({
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value,
        points: 0, // points initiaux
        createdAt: new Date(),
        panels: []
      });
      user = result.ops[0];
    }

    return done(null, user);
  } catch (err) {
    console.error(err);
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Succès → redirection dashboard
    res.redirect('/dashboard');
  }
);

export default router;
