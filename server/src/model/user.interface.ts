import { Image } from "./image.interface";

/**
 * A registered user.
 */
export interface User {
  userId: number;
  username: string;
  email: string;
  joinDate: Date;
  birthDate: any;
  bio: string;
  passwordHash: string;
  image: Image;
  likedThreads: number[];
  dislikedThreads: number[];
  likedComments: number[];
  dislikedComments: number[];
  visibleProperties: {
    email: boolean;
    joinDate: boolean;
    birthDate: boolean;
    bio: boolean;
    image: boolean;
    likedThreads: boolean;
    dislikedThreads: boolean;
  };
}
