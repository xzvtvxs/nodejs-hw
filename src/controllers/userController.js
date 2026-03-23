import createHttpError from "http-errors";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { User } from "../models/user.js";

export const updateUserAvatar = async (req, res) => {
  const file = req.file;
  if (!file) {
    throw createHttpError(400, 'No file');
  }
  const userId = req.user._id;

  const avatar = await saveFileToCloudinary(file.buffer);

  const user = await User.findByIdAndUpdate(userId, {
    avatar: avatar.secure_url,
  }, {
    returnDocument: 'after',
  });

  res.status(200).json({ url: user.avatar });
 };
