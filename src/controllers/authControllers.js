import createHttpError from "http-errors";
import { User } from "../models/user";
import bcrypt from 'bcrypt';
import { createSession, setSessionCookies } from "../services/auth";
import { Session } from "../models/session";


export const registerUser = async (req, res) => {
  const { email, password, username} = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw createHttpError(400, 'Email in use');
  }

  const hashPassword = bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashPassword,
    username,
  });

  const session = await createSession(user._id);

  await setSessionCookies(res, session);

  res.status(201).json(user);

};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw createHttpError(401, 'Invalid credentials');
  }

  Session.findOneAndDelete({ userId: user._id });

  const session = await createSession(user._id);

  await setSessionCookies(res, session);

  res.status(200).json(user);
};

export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  const session = await Session.findOne({ sessionId, refreshToken });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const refreshTokenUntilValid = session.refreshTokenValidUntil;

  if (new Date() > new Date(refreshTokenUntilValid)) {
    throw createHttpError(401, 'Session token expired');
  }

  await session.deleteOne();

  const newSession = await createSession(session.userId);

  await setSessionCookies(res, newSession);

  res.status(200).json({ "message": "Session refreshed" });
};

export const logoutUser = async(req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await Session.findByIdAndDelete(sessionId);
    res.clearCookie();
  }

  res.status(204).json();
};



