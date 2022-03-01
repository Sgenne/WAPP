export interface Comment {
  /**
   * The main text of the comment
   */
  content: string;
  /**
   * The userID of the commentor
   */
  author: number;
  /**
   * The date when the comment was posted
   */
  date: Date;
  /**
   * All the id's of the replies to the comment
   */
  replies: number[];
  /**
   * The amount of likes the comment has
   */
  likes: number;
  /**
   * The amount of dislikes the comment has
   */
  dislikes: number;
  /**
   * The unique id of the comment
   */
  commentId: number;
  isDeleted: boolean;
  thread: number;
}
