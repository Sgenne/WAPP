import { User } from "./user.interface";

export interface Comment {
  title: string;
  breadText: string;
  authour: User;
  date: Date;
  replies: Comment[];
  likes: number;
  dislikes: number;
}
