import { Router } from "express";
import { getNoteById, getAllNotes, createNote, deleteNote, updateNote } from "../controllers/notesController.js";
import { celebrate } from "celebrate";
import { createNoteSchema, getAllNotesSchema, noteIdSchema, updateNoteSchema } from "../validations/notesValidation.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.get('/notes', celebrate(getAllNotesSchema), authenticate, getAllNotes);

router.get('/notes/:noteId', celebrate(noteIdSchema), authenticate, getNoteById);

router.post('/notes', celebrate(createNoteSchema), authenticate, createNote);

router.delete('/notes/:noteId', celebrate(noteIdSchema), authenticate, deleteNote);

router.patch('/notes/:noteId', celebrate(updateNoteSchema), authenticate, updateNote);


export default router;
