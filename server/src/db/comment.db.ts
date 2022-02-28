import { Schema } from "mongoose";
import { Comment } from "../model/comment.interface";
import { db } from "./connection";

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
});

export const commentModel = db.model<Comment>("Comment", commentSchema);
