import { User } from "../model/user.interface";
import bcrypt from "bcryptjs";

const users: { [key: string]: User } = {};
interface PartialUser {
  username: string;
  birthDate?: Date;
  bio?: string;
  password?: string;
  image?: any;
}

export const editUserInformation = async (partialUser: PartialUser) => {
  const currentUser = users[partialUser.username];
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
  username: string,
  password: string
): Promise<boolean> => {
  const returnedUser = users[username];
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
  username: string,
  password: string,
  birthDate: Date
) => {
  if (
    validEmail(email) &&
    validusername(username) &&
    validPassword(password) &&
    validBirthDate(birthDate)
  ) {
    if (users[username]) {
      //User already exists
      console.log("user already exists");
      return;
    }
    const passwordHash = await hashingPassword(password);
    const newUser = {
      email,
      username,
      passwordHash,
      birthDate,
      likedThreads: [],
      unlikedThreads: [],
      joinDate: new Date(),
      visibleProperties: {
        email: true,
        joinDate: true,
        birthDate: true,
        bio: true,
        image: true,
        likedThreads: true,
        unlikedThreads: true,
      },
    };
    users[username] = newUser;
    return newUser;
  }
};

export const deleteUser = async (
  username: string,
  password: string
): Promise<{ statusCode: number; message: string }> => {
  const existingUser = users[username];

  if (!existingUser) {
    return { statusCode: 404, message: "user not found." };
  }

  const passwordIsValid = await bcrypt.compare(
    password,
    existingUser.passwordHash
  );

  if (!passwordIsValid) {
    return { statusCode: 401, message: "The given was invalid." };
  }

  delete users[username];

  return { statusCode: 200, message: "User was deleted successfully." };
};

export const getUser = async (
  username: string
): Promise<{ statusCode: number; message: string; user?: User }> => {
  const existingUser = users[username];

  if (!existingUser) {
    return { statusCode: 404, message: "user not found." };
  }

  const exposedUser = { ...existingUser, passwordHash: "" };

  return {
    statusCode: 200,
    message: "User fetched successfully.",
    user: exposedUser,
  };
};

export const setVisibleProperties = async (
  username: string,
  password: string,
  options: {
    email: boolean;
    joinDate: boolean;
    birthDate: boolean;
    bio: boolean;
    image: boolean;
    likedThreads: boolean;
    unlikedThreads: boolean;
  }
): Promise<{ statusCode: number; message: string; user?: User }> => {
  const existingUser = users[username];

  if (!existingUser) {
    return { statusCode: 404, message: "User not found." };
  }

  const passwordIsValid = await bcrypt.compare(
    password,
    existingUser.passwordHash
  );

  if (!passwordIsValid) {
    return { statusCode: 401, message: "Invalid password." };
  }

  existingUser.visibleProperties = options;

  return {
    statusCode: 200,
    message: "Visible properties updated successfully.",
    user: existingUser,
  };
};

const validEmail = (email: string): boolean => {
  return false;
};
const validImage = (image: any): boolean => {
  return false;
};
const validusername = (username: string): boolean => {
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
