import { User } from "../model/user.interface";
import { images, DEFAULT_IMAGE_ID, storeImage, deleteImage } from "./image.service";
import bcrypt from "bcryptjs";

/**
 * Temporary in-memory store.
 */
export const users: { [userId: string]: User } = {
  0: {
    userId: 0,
    username: "Deleted",
    email: "",
    joinDate: new Date(),
    birthDate: new Date(),
    passwordHash: "",
    bio: "",
    image: images[DEFAULT_IMAGE_ID],
    likedThreads: [],
    dislikedThreads: [],
    likedComments: [],
    dislikedComments: [],
    visibleProperties: {
      email: false,
      joinDate: false,
      birthDate: false,
      bio: false,
      image: false,
      likedThreads: false,
      dislikedThreads: false,
    },
  },
  1: {
    userId: 1,
    username: "Toast",
    email: "toast@gmail.com",
    joinDate: new Date(2022, 1, 22),
    birthDate: new Date(2000, 5, 18),
    passwordHash:
      "$2a$10$6cl/uWNIxhokhH8GR4BlQuTVMDlT1ptZm64vNoSPSdr5Ngeci2aEG",
    bio: "I'm burnt",
    image: images[1],
    likedThreads: [],
    dislikedThreads: [],
    likedComments: [],
    dislikedComments: [],
    visibleProperties: {
      email: true,
      joinDate: true,
      birthDate: true,
      bio: true,
      image: true,
      likedThreads: true,
      dislikedThreads: true,
    },
  },
};

/**
 * The result of a user service.
 */
interface UserServiceResult {
  /**
   * An HTTP status code describing the result of the attempted operation.
   */
  statusCode: number;

  /**
   * A message describing the result of the attempted operation.
   */
  message: string;

  /**
   * The user that the attempted service acted upon, in the case that the operation was
   * successfull.
   */
  user?: User;
}

/**
 * Updates the properties of a registered user.
 *
 * @param userId - The id of the user to update.
 *
 * @param update - An object whose defined properties
 * will be used to update the user.
 *
 * @returns A UserServiceResult object.
 */
export const updateUser = async (
  userId: number,
  update: {
    birthDate?: any;
    bio?: string;
    password?: string;
    image?: any;
  }
): Promise<UserServiceResult> => {
  const existingUser: User = users[userId];

  if (!existingUser) {
    return { statusCode: 404, message: "No user with the given id was found." };
  }
  if (update.birthDate) {
    existingUser["birthDate"] = update.birthDate;
  }
  if (update.bio) {
    existingUser["bio"] = update.bio;
  }
  if (update.password) {
    existingUser["passwordHash"] = await hashPassword(update.password);
  }
  return {
    statusCode: 200,
    message: "User updated successfully",
    user: existingUser,
  };
};

/**
 * Validates that the given password matches the stored password hash of the
 * user with the given id.
 *
 * @param userId - The id of the user.
 *
 * @param password - The password to validate.
 *
 * @returns A UserServiceResult object.
 */
export const validatePassword = async (
  userId: number,
  password: string
): Promise<UserServiceResult> => {
  const user: User = users[userId];

  if (!user) {
    return {
      statusCode: 404,
      message: "No user with the given id exists.",
    };
  }

  const passwordIsValid: boolean = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordIsValid) {
    return {
      statusCode: 401,
      message: "The given password was incorrect.",
    };
  }

  return {
    statusCode: 200,
    message: "The given password was valid.",
    user: user,
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
 * @returns A UserServiceResult object.
 */
export const register = async (
  email: string,
  username: string,
  password: string,
  birthDate: Date
): Promise<UserServiceResult> => {
  const existingUser: User | undefined = Object.values(users).find(
    (user) => user.username === username
  );

  if (existingUser) {
    return {
      statusCode: 403,
      message: "A user with the given username already exists.",
    };
  }

  const userId = new Date().getTime();
  const passwordHash = await hashPassword(password);
  const newUser: User = {
    userId,
    email,
    username,
    passwordHash,
    bio: "",
    image: images[DEFAULT_IMAGE_ID],
    birthDate,
    likedThreads: [],
    dislikedThreads: [],
    likedComments: [],
    dislikedComments: [],
    joinDate: new Date(),
    visibleProperties: {
      email: true,
      joinDate: true,
      birthDate: true,
      bio: true,
      image: true,
      likedThreads: true,
      dislikedThreads: true,
    },
  };
  users[userId] = newUser;
  return {
    statusCode: 201,
    message: "The new user was created successfully.",
    user: newUser,
  };
};

/**
 * Attempts to delete a user.
 *
 * @param userId - The id of the user to delete.
 *
 * @returns A UserServiceResult object.
 */
export const deleteUser = async (
  userId: number
): Promise<UserServiceResult> => {
  const existingUser: User = users[userId];

  if (!existingUser) {
    return { statusCode: 404, message: "user not found." };
  }

  delete users[userId];

  return { statusCode: 200, message: "The user was deleted successfully." };
};

/**
 * Returns the user object of the user with the given id, if one exists.
 */
export const getUser = async (userId: number): Promise<UserServiceResult> => {
  const existingUser: User = users[userId];

  if (!existingUser) {
    return { statusCode: 404, message: "User not found." };
  }

  return {
    statusCode: 200,
    message: "User fetched successfully.",
    user: existingUser,
  };
};

/**
 * Returns the user with the given username if one exists.
 * @param username - The username of the returned user.
 * @returns A UserServiceResult object.
 */
export const getUserByUsername = async (
  username: string
): Promise<UserServiceResult> => {
  const existingUser = Object.values(users).find(
    (user) => user.username === username
  );

  if (!existingUser)
    return {
      statusCode: 404,
      message: "No user with the given username exists.",
    };

  return {
    statusCode: 200,
    message: "The user was found successfully.",
    user: existingUser,
  };
};

/**
 * Updates the visible properties of the user with the given userId.
 *
 * @param userId - The id of the user to update.
 *
 * @param options  - An object describing which of the users properties should be visible.
 *
 * @returns A UserServiceResult object.
 */
export const setVisibleProperties = async (
  userId: number,
  options: {
    email: boolean;
    joinDate: boolean;
    birthDate: boolean;
    bio: boolean;
    image: boolean;
    likedThreads: boolean;
    dislikedThreads: boolean;
  }
): Promise<UserServiceResult> => {
  const existingUser: User = users[userId];

  if (!existingUser) {
    return { statusCode: 404, message: "User not found." };
  }

  existingUser.visibleProperties = options;

  return {
    statusCode: 200,
    message: "Visible properties updated successfully.",
    user: existingUser,
  };
};

export const updateProfilePicture = async (
  userId: number,
  image: { imageBuffer: Buffer; filename: string }
): Promise<UserServiceResult> => {
  const user = users[userId];

  if (!user) {
    return {
      statusCode: 404,
      message: "User not found.",
    };
  }

  const previousProfilePicture = user.image;

  const storageResult = await storeImage(image);
  const storedImage = storageResult.image;

  if (!storedImage) {
    return storageResult;
  }

  if (!previousProfilePicture.isDefault) {
    deleteImage(user.image);
  }

  user.image = storedImage;
  return {
    message: "The profile picture was updated successfully.",
    statusCode: 200,
    user: user,
  };
};

/**
 * Returns a hashed and salted version of the given password.
 *
 * @param password - The password to hash and salt.
 */
const hashPassword = async (password: string): Promise<string> => {
  const salt: string = await bcrypt.genSalt();
  const hashed: string = await bcrypt.hash(password, salt);
  return hashed;
};
