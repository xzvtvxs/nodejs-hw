import { Note } from "../models/note.js";
import createError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const filters = req.query;
  const { page = 1, perPage = 10 } = req.query;
  const offset = (page - 1) * perPage;

  const notesQuery = Note.find();
  if (filters.tag) {
    notesQuery.where("tag").equals(filters.tag);
    // query.tag = filters.tag;
  }
  if (filters.search) {
    // query.$text = { search: filters.search };
    notesQuery.where({ $text: { search: filters.search } });
  }
  // if (filters.title) {
  //   // query.title = filters.title;
  //   notesQuery.where("title").equals(filters.title);
  // }
  // if (filters.content) {
  //   // query.content = filters.content;
  //   notesQuery.where("content").equals(filters.content);
  // }

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


