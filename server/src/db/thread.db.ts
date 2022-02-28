import { Schema } from "mongoose";
import { Thread } from "../model/thread.interface";
import { db } from "./connection";

const threadSchema = new Schema({
  likes: {
    type: Number,
    required: true,
  },
  dislikes: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
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
  category: {
    type: Number,
    required: true,
  },
  replies: {
    type: Array(Number),
    required: true,
  },
  threadId: {
    type: Number,
    required: true,
    unique: true,
  },
});

export const threadModel = db.model<Thread>("Thread", threadSchema);
