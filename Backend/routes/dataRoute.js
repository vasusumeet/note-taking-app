import express from 'express';
import { UserData } from '../models/userData.js';
import authenticate from '../middleware/authMiddleware.js';


const dataRoute = express.Router();

// Apply authentication to all routes in this router
dataRoute.use(authenticate);

/**
 * GET all notes for a user
 * GET /api/notes/:userId/all
 */
dataRoute.get('/:userId/all', async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }
    const user = await UserData.findOne({ userId });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ notes: user.notes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * CREATE a new note
 * POST /api/notes/:userId/create
 */
dataRoute.post('/:userId/create', async (req, res) => {
  try {
    const { userId } = req.params;
    const { noteTitle, note } = req.body;
    if (!noteTitle || !note) {
      return res.status(400).json({ message: 'Title and note content are required.' });
    }
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }
    const user = await UserData.findOne({ userId });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const newNote = { noteTitle, note, dateCreated: new Date() };
    user.notes.push(newNote);
    await user.save();

    res.status(201).json({ message: 'Note created', note: user.notes[user.notes.length - 1], notes: user.notes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * EDIT an existing note
 * PUT /api/notes/:userId/edit/:noteId
 */
dataRoute.put('/:userId/edit/:noteId', async (req, res) => {
  try {
    const { userId, noteId } = req.params;
    const { noteTitle, note } = req.body;

    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }
    const user = await UserData.findOne({ userId });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const noteToEdit = user.notes.id(noteId);
    if (!noteToEdit) return res.status(404).json({ message: 'Note not found.' });

    if (noteTitle) noteToEdit.noteTitle = noteTitle;
    if (note) noteToEdit.note = note;
    await user.save();

    res.json({ message: 'Note updated', note: noteToEdit, notes: user.notes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * DELETE a note
 * DELETE /api/notes/:userId/delete/:noteId
 */
dataRoute.delete('/:userId/delete/:noteId', async (req, res) => {
  try {
    const { userId, noteId } = req.params;

    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }
    const user = await UserData.findOne({ userId });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const noteToDelete = user.notes.id(noteId);
    if (!noteToDelete) return res.status(404).json({ message: 'Note not found.' });

    noteToDelete.deleteOne();
    await user.save();

    res.json({ message: 'Note deleted', notes: user.notes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default dataRoute;
