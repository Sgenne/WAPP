import { Comment } from "./comment.interface";
import { User } from "./user.interface";

export interface Thread {
  likes: number;
  dislikes: number;
  title: string;
  content: string;
  author: number;
  date: Date;
  category: string;
  replies: number[]; //Comment type later
  threadId: number;
}
