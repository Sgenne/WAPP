import { Thread } from "./thread.interface";

export interface User {
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
  likedThreads: any[]; //Threads type later

  /**
   * The threads that the user has disliked.
   */
  unlikedThreads: any[];

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
