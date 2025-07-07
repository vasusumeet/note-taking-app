import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
  noteTitle: { type: String, required: true },
  note: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now, required: true }
});

const userDataSchema = new mongoose.Schema({
  userId: { type: String, required: true }, 
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  notes: [notesSchema],
});

export const UserData = mongoose.model('UserData', userDataSchema);
