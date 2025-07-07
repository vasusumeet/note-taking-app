import express from 'express';
import { LoginData } from '../models/userLogin.js'; 
import { UserData } from '../models/userData.js';
import bcryptjs from 'bcryptjs'; 
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config.js';

const loginRoute = express.Router();

/**
 * SIGNUP ROUTE
 */
loginRoute.post('/signup', async (req, res) => {
  try {
    const { name, email, password, profilePicture } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Enter all fields: Name, Email, and Password' });
    }

    // Check if the user already exists
    const existing = await LoginData.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create and save the LoginData document
    const newUser = new LoginData({ name, email, password: hashedPassword, profilePicture });
    await newUser.save();

    // Create and save the UserData document with userId, name, and email
    const newUserData = new UserData({
      userId: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      notes: []
    });
    await newUserData.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id.toString(), name: newUser.name, email: newUser.email },
      jwtSecret,
      { expiresIn: '7d' }
    );

    // Prepare user data to send in response (exclude password)
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
 * LOGIN ROUTE
 */
loginRoute.post('/login', async (req, res) => {
  try {
    const { email, password, googleId } = req.body;

    if (!email || (!password && !googleId)) {
      return res.status(400).json({ message: 'Email and password or Google ID are required.' });
    }

    // Find user by email
    const user = await LoginData.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Google login
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

    // Fetch user's notes from UserData
    const userData = await UserData.findOne({ email: user.email });

    // Generate JWT token
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

export default loginRoute;
