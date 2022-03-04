/**
 * A discussion thread.
 */
export interface Thread {
  likes: number;
  dislikes: number;
  title: string;
  content: string;
  author: number;
  date: Date;
  category: number;
  replies: number[];
  threadId: number;
}
