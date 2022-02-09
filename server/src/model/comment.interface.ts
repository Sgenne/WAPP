import { User } from "./user.interface";

export interface Comment {
  title: string;
  content: string;
  authour: User;
  date: Date;
  replies: Comment[];
  likes: number;
  dislikes: number;
  commentId: number;
}
