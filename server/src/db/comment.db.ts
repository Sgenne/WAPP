import { Schema, model } from "mongoose";
import { Comment } from "../model/comment.interface";

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  replies: {
    type: Array(Number),
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  dislikes: {
    type: Number,
    required: true,
  },
  commentId: {
    type: Number,
    required: true,
    unique: true,
  },
  isDeleted: {
    type: Boolean,
    required: true,
  },
});

export const commentModel = model<Comment>("Comment", commentSchema);
