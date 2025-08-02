import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authMiddleware } from "../middleware/auth.js";


const router = express.Router();

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      favourites: user.favourites || [],
      doneCards: user.doneCards || [],
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Failed to load user profile" });
  }
});

// REGISTERED USER LOGIN
// 📍 server/routes/auth.js

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: "registered" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // Send only one response here
  return res.status(200).json({
    token, // send token in body
    email: user.email,
    role: "registered"
  });
});



// REGISTER: NEW CODE
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Check for duplicate
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({ email, password: hash });
    await user.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// GUEST LOGIN
router.post("/guest", (req, res) => {
  console.log('Guest login route triggered');
  const guestToken = jwt.sign(
    { role: "guest" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return res.status(200).json({
    token: guestToken,
    email: null,
    role: "guest"
  });
});



export default router;
