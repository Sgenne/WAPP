import { Thread } from "./thread.interface";

export interface User {
  username: string;
  email: string;
  joinDate: Date;
  birthDate: any;
  bio?: string;
  passwordHash: string;
  image?: any;
  likedThreads: any[]; //Threads type later
  unlikedThreads: any[];

  // Determines which properties are visible on the profile page.
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
