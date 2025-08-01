// 📄 server/routes/user.js
import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// GET /api/user/profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      favourites: user.favourites || [],
      doneCards: user.doneCards || [],
    });
  } catch (err) {
    console.error('Error in /api/user/profile:', err);
    res.status(500).json({ error: 'Failed to load user profile' });
  }
});

// POST /api/user/favourites
router.post('/favourites', authMiddleware, async (req, res) => {
  const { cardId, action } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (action === 'add') {
      if (!user.favourites.includes(cardId)) {
        user.favourites.push(cardId);
      }
    } else if (action === 'remove') {
      user.favourites = user.favourites.filter(id => id !== cardId);
    }

    await user.save();
    res.status(200).json({ favourites: user.favourites });
  } catch (err) {
    console.error('Error in /api/user/favourites:', err);
    res.status(500).json({ error: 'Failed to update favourites' });
  }
});

// POST /api/user/done
router.post('/done', authMiddleware, async (req, res) => {
  const { cardId } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const alreadyDone = user.doneCards.some(entry => entry.cardId === cardId);
    if (!alreadyDone) {
      user.doneCards.push({ cardId, ts: Date.now() });
      await user.save();
    }

    res.status(200).json({ doneCards: user.doneCards });
  } catch (err) {
    console.error('Error in /api/user/done:', err);
    res.status(500).json({ error: 'Failed to update done status' });
  }
});

export default router;
