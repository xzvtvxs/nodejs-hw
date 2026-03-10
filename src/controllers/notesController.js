import { NoteCollection } from "../models/note.js";
import createError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const result = await NoteCollection.find();

  res.status(200).json(result);
};

export const getNoteById = async (req, res) => {
    const { noteId } = req.params;

    const result = await NoteCollection.findById(noteId);
    if (!result) {
      throw createError(404, 'Note not found');
    }
    res.status(200).json(result);
};

export const createNote = async (req, res) => {
  const body = req.body;

  const result = await NoteCollection.create(body);
  res.status(201).json(result);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;

  const result = await NoteCollection.findByIdAndDelete(noteId);
  if (!result) {
    throw createError(404, 'Note not found');
  }
  res.status(200).json(result);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const body = req.body;

  const result = await NoteCollection.findByIdAndUpdate(noteId, body, {new: true});
  if (!result) {
    throw createError(404, 'Note not found');
  }
  res.status(200).json(result);
};
