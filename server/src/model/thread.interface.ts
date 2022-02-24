export interface Thread {
  /**
   * Number of likes on the thread
   */
  likes: number;
  /**
   * Number of dislikes on the thread
   */
  dislikes: number;
  /**
   * The header of the thread
   */
  title: string;
  /**
   * The breadtext of the thread
   */
  content: string;
  /**
   * The author who wrote the thread
   */
  author: number;
  /**
   * Publish date for thread
   */
  date: Date;
  /**
   * The category the thread resides in
   */
  category: number;
  /**
   * All comments in id who have commented on the thread
   */
  replies: number[];
  /**
   * The number of the thread, is unique to every thread
   */
  threadId: number;
}
