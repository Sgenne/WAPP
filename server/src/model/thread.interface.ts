import { Comment } from "./comment.interface";
import { User } from "./user.interface";

export interface Thread {
  likes: number;
  dislikes: number;
  title: string;
  content: string;
  author: User;
  date: Date;
  category: string;
  replies: Comment[]; //Comment type later
  threadId: number;
}
