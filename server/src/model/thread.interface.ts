import { Comment } from "./comment.interface";
import { User } from "./user.interface";

export interface Thread {
  likes: number;
  dislikes: number;
  title: string;
  breadText: string;
  author: User;
  dare: Date;
  category: string;
  replies: Comment[]; //Comment type later
}
