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

export const editUserInformation = async (
  partialUser: PartialUser
): Promise<{ message: string; statusCode: number; user?: User }> => {
  // Todo: check that password is correct before editing user.
  const existingUser = users[partialUser.username];
  if (!existingUser) {
    return { statusCode: 404, message: "User not found." };
  }
  if (partialUser.birthDate) {
    if (validBirthDate(partialUser.birthDate)) {
      existingUser["birthDate"] = partialUser.birthDate;
    }
  }
  if (partialUser.bio) {
    if (validBio(partialUser.bio)) {
      existingUser["bio"] = partialUser.bio;
    }
  }
  if (partialUser.password) {
    if (validPassword(partialUser.password)) {
      existingUser["passwordHash"] = await hashPassword(partialUser.password);
    }
  }
  if (partialUser.image) {
    if (validImage(partialUser.image)) {
      existingUser["image"] = partialUser.image;
    }
  }
  return {
    statusCode: 200,
    message: "User updated successfully",
    user: existingUser,
  };
};

export const signIn = async (
  username: string,
  password: string
): Promise<{ message: string; statusCode: number; user?: User }> => {
  const existingUser = users[username];

  if (!existingUser) {
    return { statusCode: 404, message: "User not found." };
  }

  const passwordIsValid = await bcrypt.compare(
    password,
    existingUser.passwordHash
  );
  if (!passwordIsValid) {
    return { statusCode: 401, message: "The given password was invalid." };
  }

  return {
    statusCode: 200,
    message: "The user was signed in successfully.",
    user: existingUser,
  };
};

export const register = async (
  email: string,
  username: string,
  password: string,
  birthDate: Date
): Promise<{ message: string; statusCode: number; user?: User }> => {
  if (
    !validEmail(email) &&
    validusername(username) &&
    validPassword(password) &&
    validBirthDate(birthDate)
  ) {
    return { statusCode: 400, message: "Invalid input" };
  }
  if (users[username]) {
    return {
      statusCode: 403,
      message: "A user with the given username already exists.",
    };
  }

  const passwordHash = await hashPassword(password);
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
  return {
    statusCode: 201,
    message: "The new user was created successfully.",
    user: newUser,
  };
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
const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
};
