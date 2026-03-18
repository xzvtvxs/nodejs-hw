import { Note } from "../models/note.js";
import createError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const user = req.user;

  const filters = req.query;
  const { page = 1, perPage = 10 } = req.query;
  const offset = (page - 1) * perPage;

  const notesQuery = Note.find({
    userId: user._id,
  });
  if (filters.tag) {
    notesQuery.where("tag").equals(filters.tag);
    // query.tag = filters.tag;
  }
  if (filters.search) {
    // query.$text = { search: filters.search };
    notesQuery.where({ $text: { search: filters.search } });
  }

  const [totalNotes, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(offset).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({
    page: Number(page),
    perPage: Number(perPage),
    totalNotes,
    totalPages,
    notes,
  });
};

export const getNoteById = async (req, res) => {
  const user = req.user;

    const { noteId } = req.params;

  const result = await Note.find({
    _id: noteId,
    user: user._id,
    });
    if (!result) {
      throw createError(404, 'Note not found');
    }
    res.status(200).json(result);
};

export const createNote = async (req, res) => {
  const user = req.user;

  const body = req.body;

  const result = await Note.create({
    ...body,
    userId: user._id,
  });
  res.status(201).json(result);
};

export const deleteNote = async (req, res) => {
  const user = req.user;

  const { noteId } = req.params;

  const result = await Note.findOneAndDelete({
    _id: noteId,
    userId: user._id,
  });
  if (!result) {
    throw createError(404, 'Note not found');
  }
  res.status(200).json(result);
};

export const updateNote = async (req, res) => {
  const user = req.user;

  const { noteId } = req.params;
  const body = req.body;

  const result = await Note.findOneAndUpdate({_id: noteId, userId: user._id,}, body, {new: true});
  if (!result) {
    throw createError(404, 'Note not found');
  }
  res.status(200).json(result);
};


