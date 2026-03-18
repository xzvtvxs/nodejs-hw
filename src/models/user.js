import { model, Schema } from "mongoose";

const userSchema = new Schema({
  username: { type: String, trim: true },
  email: { type: String, unique: true, trim: true },
  password: { type: String, required: true, }
}, {
  timestamps: true,
  versionKey: false,
});

userSchema.pre('save', function () {
  if (!this.username) {
    this.username = this.email;
  }
});

userSchema.methods.toJSON = (user) => {
  const { password, ...rest } = user.toObject();
  return rest;
};

export const User = model('User', userSchema);
