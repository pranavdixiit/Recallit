import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: String,
  favourites: [{ type: String }],   // array of card._id
  doneCards: [{ cardId: String, ts: Number }],
});

export default mongoose.model('User', UserSchema);

