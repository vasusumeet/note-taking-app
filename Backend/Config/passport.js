import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { LoginData } from '../models/userLogin.js'; 
import { jwtSecret } from '../config.js';
import jwt from 'jsonwebtoken';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID, // from Google Cloud
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5555/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  // Find or create user
  let user = await LoginData.findOne({ email: profile.emails[0].value });
  if (!user) {
    user = await LoginData.create({
      name: profile.displayName,
      email: profile.emails[0].value,
      googleId: profile.id,
      profilePicture: profile.photos[0]?.value
    });

  }
  return done(null, user);
}));

