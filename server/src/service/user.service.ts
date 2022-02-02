import { User } from "../model/user.interface";
import bcrypt from "bcryptjs";

const users: { [key: string]: User } = {};
interface PartialUser {
  userName: string;
  birthDate?: Date;
  bio?: string;
  password?: string;
  image?: any;
}

export const editUserInformation = async (partialUser: PartialUser) => {
  const currentUser = users[partialUser.userName];
  if (!currentUser) {
    console.log("No user found!");
    return;
  }
  if (partialUser.birthDate) {
    if (validBirthDate(partialUser.birthDate)) {
      currentUser["birthDate"] = partialUser.birthDate;
    }
  }
  if (partialUser.bio) {
    if (validBio(partialUser.bio)) {
      currentUser["bio"] = partialUser.bio;
    }
  }
  if (partialUser.password) {
    if (validPassword(partialUser.password)) {
      currentUser["passwordHash"] = await hashingPassword(partialUser.password);
    }
  }
  if (partialUser.image) {
    if (validImage(partialUser.image)) {
      currentUser["image"] = partialUser.image;
    }
  }
  return currentUser;
};

export const signIn = async (
  userName: string,
  password: string
): Promise<boolean> => {
  const returnedUser = users[userName];
  if (returnedUser) {
    const verifiedPassword = await bcrypt.compare(
      password,
      returnedUser.passwordHash
    );
    if (!verifiedPassword) {
      console.log("False! Pepega");
      return false;
    }
    console.log("Logged in! Poggers");
    return true;
  }
  console.log("User not found!");
  return false;
};

export const register = async (
  email: string,
  userName: string,
  password: string,
  birthDate: Date
) => {
  if (
    validEmail(email) &&
    validUserName(userName) &&
    validPassword(password) &&
    validBirthDate(birthDate)
  ) {
    if (users[userName]) {
      //User already exists
      console.log("user already exists");
      return;
    }
    const passwordHash = await hashingPassword(password);
    const newUser = {
      email,
      userName,
      passwordHash,
      birthDate,
      likedThreads: [],
      unlikedThreads: [],
      joinDate: new Date(),
    };
    users[userName] = newUser;
    return newUser;
  }
};

const validEmail = (email: string): boolean => {
  return false;
};
const validImage = (image: any): boolean => {
  return false;
};
const validUserName = (userName: string): boolean => {
  return false;
};

const validPassword = (password: string): boolean => {
  return false;
};

const validBirthDate = (date: Date): boolean => {
  return false;
};

const validBio = (bio: string): boolean => {
  return false;
};
const hashingPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
};
