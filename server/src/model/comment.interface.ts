import { User } from "./user.interface";

export interface Comment {
  content: string;
  authour: User;
  date: Date;
  replies: Comment[];
  likes: number;
  dislikes: number;
  commentId: number;
}
