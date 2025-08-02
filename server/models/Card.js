// server/models/Card.js
import mongoose from 'mongoose';

export default mongoose.model('Card', new mongoose.Schema({
  question: String,
  answer: String,
  topic: String,
  deck: String,
  code: { type: String, default: '' },          // Stores code snippet as string
  codeLanguage: { type: String, default: 'cpp' },
  interval: { type: Number, default: 1 },
  easeFactor: { type: Number, default: 2.5 },
  repetitions: { type: Number, default: 0 },
  nextReview: { type: Date, default: Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
   done: { type: Boolean, default: false }
}));
