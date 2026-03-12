import { Note } from "../models/note.js";
import createError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const filters = req.query;
  const { page = 1, perPage = 10 } = req.query;
  const offset = (page - 1) * perPage;

  const query = {};
  if (filters.tag) {
    query.tag = filters.tag;
  }
  if (filters.search) {
    query.$text = { search: filters.search };
  }
  if (filters.title) {
    query.title = filters.title;
  }
  if (filters.content) {
    query.content = filters.content;
  }
  const notesQuery = Note.find(query);
  const [totalItems, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(offset).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    page,
    perPage,
    totalItems,
    totalPages,
    notes,
  });
};

export const getNoteById = async (req, res) => {
    const { noteId } = req.params;

    const result = await Note.findById(noteId);
    if (!result) {
      throw createError(404, 'Note not found');
    }
    res.status(200).json(result);
};

export const createNote = async (req, res) => {
  const body = req.body;

  const result = await Note.create(body);
  res.status(201).json(result);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;

  const result = await Note.findByIdAndDelete(noteId);
  if (!result) {
    throw createError(404, 'Note not found');
  }
  res.status(200).json(result);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const body = req.body;

  const result = await Note.findByIdAndUpdate(noteId, body, {new: true});
  if (!result) {
    throw createError(404, 'Note not found');
  }
  res.status(200).json(result);
};


