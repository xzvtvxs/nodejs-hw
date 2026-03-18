import { model, Schema } from "mongoose";

const userSchema = new Schema({
  username: { type: String, trim: true },
  email: { type: String, unique: true, trim: true, required: true },
  password: { type: String, required: true, trim: true }
}, {
  timestamps: true,
  versionKey: false,
});

userSchema.pre('save', function () {
  if (!this.username) {
    this.username = this.email;
  }
});

userSchema.methods.toJSON = function () {
  const { password, ...rest } = this.toObject();
  return rest;
};

export const User = model('User', userSchema);
