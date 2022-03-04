/**
 * A comment to a thread or to another comment.
 */
export interface Comment {
  content: string;
  author: number;
  date: Date;
  replies: number[];
  likes: number;
  dislikes: number;
  commentId: number;
  isDeleted: boolean;
  rootThread: number;
}
