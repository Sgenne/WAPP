export interface User {
    userName: string;
    email: string;
    joinDate: Date;
    birthDate: Date;
    bio?: string;
    passwordHash: string;
    image?: any;
    likedThreads: any[]; //Threads type later
    unlikedThreads: any[];
}