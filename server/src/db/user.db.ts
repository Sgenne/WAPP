import { Schema, model } from "mongoose";
import { User } from "../model/user.interface";

const userSchema: Schema = new Schema({
  userId: {
    type: Number,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  joinDate: {
    type: Date,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  image: {
    type: Object,
    required: true,
  },
  likedThreads: {
    type: Array(Number),
    required: true,
  },
  dislikedThreads: {
    type: Array(Number),
    required: true,
  },
  likedComments: {
    type: Array(Number),
    required: true,
  },
  dislikedComments: {
    type: Array(Number),
    required: true,
  },
  visibleProperties: {
    type: Object,
    required: true,
  },
});

export const userModel = model<User>("User", userSchema);
