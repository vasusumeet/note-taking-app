import express from 'express';
import { LoginData } from '../models/userLogin.js';
import { UserData } from '../models/userData.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config.js';
import passport from 'passport';
import '../Config/passport.js'; // Make sure this path is correct!
import { OAuth2Client } from 'google-auth-library';

const loginRoute = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * EMAIL/PASSWORD SIGNUP
 */
loginRoute.post('/signup', async (req, res) => {
  try {
    const { name, email, password, profilePicture } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Enter all fields: Name, Email, and Password' });
    }

    const existing = await LoginData.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new LoginData({ name, email, password: hashedPassword, profilePicture });
    await newUser.save();

    await UserData.create({
      userId: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      notes: []
    });

    const token = jwt.sign(
      { id: newUser._id.toString(), name: newUser.name, email: newUser.email },
      jwtSecret,
      { expiresIn: '7d' }
    );

    const userResponse = {
      id: newUser._id,
      userId: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      profilePicture: newUser.profilePicture || null,
      notes: []
    };

    return res.status(201).json({
      message: 'User created successfully',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

/**
 * EMAIL/PASSWORD LOGIN
 */
loginRoute.post('/login', async (req, res) => {
  try {
    const { email, password, googleId } = req.body;

    if (!email || (!password && !googleId)) {
      return res.status(400).json({ message: 'Email and password or Google ID are required.' });
    }

    const user = await LoginData.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Google login via GoogleId (for legacy support)
    if (googleId) {
      if (!user.googleId || user.googleId !== googleId) {
        return res.status(401).json({ message: 'Invalid Google credentials.' });
      }
    } else {
      // Password login
      if (!user.password) {
        return res.status(401).json({ message: 'No password set for this account. Use Google login.' });
      }
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
    }

    const userData = await UserData.findOne({ email: user.email });

    const token = jwt.sign(
      { id: user._id.toString(), name: user.name, email: user.email },
      jwtSecret,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'User authenticated successfully',
      user: {
        id: user._id,
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture || null,
        notes: userData ? userData.notes : []
      },
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

/**
 * GOOGLE LOGIN/REGISTER (for Google Identity Services/One Tap)
 * POST /api/auth/google
 * Receives { token } from frontend, verifies with Google, finds or creates user, returns JWT and user info
 */
loginRoute.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Find or create user
    let user = await LoginData.findOne({ email: payload.email });
    if (!user) {
      user = await LoginData.create({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
        profilePicture: payload.picture,
      });
      await UserData.create({
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        notes: []
      });
    }

    const userData = await UserData.findOne({ email: user.email });

    const jwtToken = jwt.sign(
      { id: user._id.toString(), name: user.name, email: user.email },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Google login successful',
      user: {
        id: user._id,
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture || null,
        notes: userData ? userData.notes : []
      },
      token: jwtToken
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Google authentication failed.' });
  }
});

/**
 * GOOGLE OAUTH REDIRECT FLOW (Passport)
 */
loginRoute.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

loginRoute.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/LoginPage' }),
  async (req, res) => {
    const token = jwt.sign(
      { id: req.user._id.toString(), name: req.user.name, email: req.user.email },
      jwtSecret,
      { expiresIn: '7d' }
    );

    const userData = await UserData.findOne({ email: req.user.email });

    res.json({
      message: 'Google login successful',
      user: {
        id: req.user._id,
        userId: req.user._id.toString(),
        name: req.user.name,
        email: req.user.email,
        profilePicture: req.user.profilePicture || null,
        notes: userData ? userData.notes : []
      },
      token
    });
  }
);

export default loginRoute;
