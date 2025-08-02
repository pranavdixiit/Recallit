import express from 'express';
import Card from '../models/Card.js';
import { updateSM2 } from '../utils/sm2.js';
import { authMiddleware, registeredOnly } from '../middleware/auth.js';

const router = express.Router();

// Get all cards for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  const cards = await Card.find({ owner: req.user.id });
  res.json(cards);
});

// Create a card (registered users only)
router.post("/", authMiddleware, registeredOnly, async (req, res) => {
  const { question, answer, topic, deck, code, codeLanguage } = req.body;
  const card = new Card({
    owner: req.user.id,
    question,
    answer,
    topic,
    deck,
    // Add fields for SM2 spaced repetition if needed
    code: code || '',              // add this line
    codeLanguage: codeLanguage || 'cpp', // and this
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReview: new Date(),
  });
  await card.save();
  res.status(201).json(card);
});

// Delete a card (registered users only)
router.delete('/:id', authMiddleware, registeredOnly, async (req, res) => {
  try {
    await Card.deleteOne({ _id: req.params.id, owner: req.user.id });
    res.status(204).end();
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Failed to delete card" });
  }
});

// Review/update a card (registered users only)
router.post('/:id/review', authMiddleware, registeredOnly, async (req, res) => {
  const card = await Card.findOne({ _id: req.params.id, owner: req.user.id });
  if (!card) return res.status(404).json({ error: "Card not found" });

  const result = updateSM2(card, req.body.quality);
  Object.assign(card, result);
  await card.save();
  res.json(card);
});

// Update card data (e.g. to mark done or update nextReview)
router.put('/:id', authMiddleware, registeredOnly, async (req, res) => {
  const { id } = req.params;
  const { done, nextReview } = req.body;

  try {
    const updatedCard = await Card.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      { $set: { done, nextReview } },
      { new: true }
    );

    if (!updatedCard) {
      return res.status(404).json({ message: 'Card not found or not owned by user' });
    }

    res.status(200).json(updatedCard);
  } catch (error) {
    console.error('Update failed:', error);
    res.status(500).json({ error: 'Failed to update card' });
  }
});

// Mark/unmark a favourite
router.post('/favourites', authMiddleware, async (req, res) => {
  const { cardId, action } = req.body;
  const user = await User.findById(req.user.id);

  if (action === 'add') {
    if (!user.favourites.includes(cardId)) user.favourites.push(cardId);
  } else if (action === 'remove') {
    user.favourites = user.favourites.filter(id => id !== cardId);
  }

  await user.save();
  res.status(200).json({ favourites: user.favourites });
});

router.post('/done', authMiddleware, async (req, res) => {
  const { cardId } = req.body;
  const user = await User.findById(req.user.id);

  if (!user.doneCards.some(e => e.cardId === cardId)) {
    user.doneCards.push({ cardId, ts: Date.now() });
    await user.save();
  }

  res.status(200).json({ doneCards: user.doneCards });
});

router.get('/profile', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({
    favourites: user.favourites || [],
    doneCards: user.doneCards || [],
  });
});


export default router;
