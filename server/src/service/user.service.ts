import { User } from "../model/user.interface";
import bcrypt from "bcryptjs";

// Temporary in-memory store.
const users: { [key: string]: User } = {};

interface PartialUser {
  username: string;
  birthDate?: any;
  bio?: string;
  password?: string;
  image?: any;
}

/**
 * Updates the properties of a registered user.
 *
 * @param partialUser - An object whose birthDate, bio, password, and image
 * properties will, if defined, be used to updated the user.
 *
 * @returns An object containing information about if the service succeeded
 * and the updated user if one was updated.
 */
export const editUserInformation = async (
  partialUser: PartialUser
): Promise<{ message: string; statusCode: number; user?: User }> => {
  /* 
    Todo: check that password is correct before editing user.
    Needs to take the password as a separate argument since we
    want to be able to provide the password without updating it.
  */

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

/**
 * Attempts to sign a user in with the given username and password.
 *
 * @param username - The username to use when signing the user in.
 *
 * @param password - The password to use when signing the user in.
 *
 * @returns An object indicating the success of the attempted
 * sign-in. If successfull, then the object will contain the user object
 * of the signed in user.
 *
 */
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

/**
 * Attempts to register a user with the given information.
 *
 * @param email - The email of the new user.
 *
 * @param username - The username of the new user.
 *
 * @param password - The password of the new user.
 *
 * @param birthDate - The date of birth of the new user.
 *
 * @returns An object indicating success of the service.
 * If the new user was registered, then the object will
 */
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

/**
 * Attempts to delete a user.
 *
 * @param username - The username of the user to delete.
 *
 * @param password - The password of the user to delete.
 *
 * @returns An object containing the result of the attempted service.
 */
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
    return { statusCode: 401, message: "The given password was invalid." };
  }

  delete users[username];

  return { statusCode: 200, message: "The user was deleted successfully." };
};

/**
 * Returns the user object of the user with the given username, if one exists.
 */
export const getUser = async (
  username: string
): Promise<{ statusCode: number; message: string; user?: User }> => {
  const existingUser = users[username];

  if (!existingUser) {
    return { statusCode: 404, message: "User not found." };
  }

  const exposedUser = { ...existingUser, passwordHash: "" };

  return {
    statusCode: 200,
    message: "User fetched successfully.",
    user: exposedUser,
  };
};

/**
 * Updates the visible properties of the user with the given username and password.
 *
 * @param username - The username of the user to update.
 *
 * @param password - The password of the user to update.
 *
 * @param options  - An object describing which of the users properties should be visible.
 *
 * @returns An object containing the result of the attempted service.
 */
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

/**
 * Returns a boolean indicating if the given email address is valid.
 */
const validEmail = (email: string): boolean => {
  return true;
};

/**
 * Returns a boolean indicating if the given image is valid.
 */
const validImage = (image: any): boolean => {
  return true;
};

/**
 * Returns a boolean indicating if the given username is valid.
 */
const validusername = (username: string): boolean => {
  return true;
};

/**
 * Returns a boolean indicating if the given password is valid.
 */
const validPassword = (password: string): boolean => {
  return true;
};

/**
 * Returns a boolean indicating if the given date of birth is valid.
 */
const validBirthDate = (date: Date): boolean => {
  return true;
};

/**
 * Returns a boolean indicating if the given bio is valid.
 */
const validBio = (bio: string): boolean => {
  return true;
};

/**
 * Returns a hashed and salted version of the given password.
 *
 * @param password - The password to hash and salt.
 */
const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
};
