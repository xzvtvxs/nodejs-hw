// src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errors } from 'celebrate';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler} from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';




const app = express();
dotenv.config();
const PORT = process.env.PORT ?? 3000;
app.use(logger);
app.use(express.json());
app.use(cors());

await connectMongoDB();

app.use(notesRouter);
app.use(authRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);










// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
