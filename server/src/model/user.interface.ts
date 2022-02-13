export interface User {
  /**
   * The id of the user.
   */
  userId: number;

  /**
   * The username of the user.
   */
  username: string;

  /**
   * The email of the user.
   */
  email: string;

  /**
   * The date at which the user joined the site.
   */
  joinDate: Date;

  /**
   * The date of birth of the user.
   */
  birthDate: any;

  /**
   * The biography of the user.
   */
  bio?: string;

  /**
   * A hashed and salted version of the users password.
   */
  passwordHash: string;

  /**
   * The profile picture of the user.
   */
  image?: any;

  /**
   * The threads that the user has liked.
   */
  likedThreads: number[];

  /**
   * The threads that the user has disliked.
   */
  dislikedThreads: number[];

  /**
   * The comments that the user has liked.
   */
  likedComments: number[];

  /**
   * The comments that the user had disliked.
   */
  dislikedComments: number[];

  /**
   * Indicates which of the users properties should be visible on their profile page.
   */
  visibleProperties: {
    email: boolean;
    joinDate: boolean;
    birthDate: boolean;
    bio: boolean;
    image: boolean;
    likedThreads: boolean;
    unlikedThreads: boolean;
  };
}
