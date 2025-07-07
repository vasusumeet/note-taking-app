import express from 'express';
import { UserData } from '../models/UserData.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const dataRoute = express.Router();

// CREATE a new note
dataRoute.post('/create', authMiddleware, async (req, res) => {
  try {
    const { noteTitle, note } = req.body;
    if (!noteTitle || !note) {
      return res.status(400).json({ message: 'Title and note content are required.' });
    }
    const user = await UserData.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const newNote = { noteTitle, note, dateCreated: new Date() };
    user.notes.push(newNote);
    await user.save();

    res.status(201).json({ message: 'Note created', note: user.notes[user.notes.length - 1] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// EDIT an existing note
dataRoute.put('/edit/:noteId', authMiddleware, async (req, res) => {
  try {
    const { noteTitle, note } = req.body;
    const { noteId } = req.params;

    const user = await UserData.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const noteToEdit = user.notes.id(noteId);
    if (!noteToEdit) return res.status(404).json({ message: 'Note not found.' });

    if (noteTitle) noteToEdit.noteTitle = noteTitle;
    if (note) noteToEdit.note = note;
    await user.save();

    res.json({ message: 'Note updated', note: noteToEdit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a note
dataRoute.delete('/delete/:noteId', authMiddleware, async (req, res) => {
  try {
    const { noteId } = req.params;

    const user = await UserData.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const noteToDelete = user.notes.id(noteId);
    if (!noteToDelete) return res.status(404).json({ message: 'Note not found.' });

    noteToDelete.deleteOne();
    await user.save();

    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default dataRoute;
