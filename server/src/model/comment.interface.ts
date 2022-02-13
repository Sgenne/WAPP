import { User } from "./user.interface";

export interface Comment {
  content: string;
  authour: number;
  date: Date;
  replies: number[];
  likes: number;
  dislikes: number;
  commentId: number;
}
