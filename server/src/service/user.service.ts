import { User } from "../model/user.interface";
import { storeImage, deleteImage, DEFAULT_IMAGE } from "./image.service";
import bcrypt from "bcryptjs";
import { userModel } from "../db/user.db";

/**
 * The result of a user service. Contains a status code and message describing the
 * result of the attempted service. If the service was successful, then the result
 * will contain the relevant user.
 */
export interface UserServiceResult {
  statusCode: number;
  message: string;
  user?: User;
}

/**
 * Updates the properties of a registered user.
 *
 * @param userId - The id of the user to update.
 *
 * @param update - An object whose defined properties
 * will be used to update the user.
 */
export const updateUser = async (
  userId: number,
  update: {
    birthDate?: Date;
    bio?: string;
    password?: string;
    visibleProperties?: object;
    email?: string;
  }
): Promise<UserServiceResult> => {
  const existingUser: User | null = await userModel.findOne({
    userId: userId,
  });

  if (!existingUser) {
    return { statusCode: 404, message: "No user with the given id was found." };
  }

  await userModel.updateOne(
    { userId: userId },
    {
      birthDate: update.birthDate ? update.birthDate : existingUser.birthDate,
      bio: update.bio ? update.bio : existingUser.bio,
      email: update.email ? update.email : existingUser.email,
      visibleProperties: update.visibleProperties
        ? update.visibleProperties
        : existingUser.visibleProperties,
      passwordHash: update.password
        ? await hashPassword(update.password)
        : existingUser.passwordHash,
    }
  );

  const updatedUser = await userModel.findOne({
    userId: userId,
  });

  if (!updatedUser) {
    return { statusCode: 404, message: "No user with the given id was found." };
  }

  return {
    statusCode: 200,
    message: "User updated successfully",
    user: updatedUser,
  };
};

/**
 * Validates that the given password matches the stored password hash of the
 * user with the given id.
 *
 * @param userId - The id of the user.
 *
 * @param password - The password to validate.
 */
export const validatePassword = async (
  userId: number,
  password: string
): Promise<UserServiceResult> => {
  const user: User | null = await userModel.findOne({ userId: userId });

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
 */
export const register = async (
  email: string,
  username: string,
  password: string,
  birthDate: Date
): Promise<UserServiceResult> => {
  const existingUser: User | null = await userModel.findOne({
    username: username,
  });

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
    profilePicture: DEFAULT_IMAGE,
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
      profilePicture: true,
      likedThreads: true,
      dislikedThreads: true,
    },
  };

  await userModel.create(newUser);

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
 */
export const deleteUser = async (
  userId: number
): Promise<UserServiceResult> => {
  const deletedUser = await userModel.deleteOne({ userId: userId });

  if (!deletedUser) {
    return { statusCode: 404, message: "user not found." };
  }

  return { statusCode: 200, message: "The user was deleted successfully." };
};

/**
 * Returns the user object of the user with the given id, if one exists.
 */
export const getUser = async (userId: number): Promise<UserServiceResult> => {
  const existingUser: User | null = await userModel.findOne({ userId: userId });

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
 */
export const getUserByUsername = async (
  username: string
): Promise<UserServiceResult> => {
  const existingUser = await userModel.findOne({
    username: { $regex: new RegExp("^" + username + "$", "i") },
  });

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
  const updateResult = await userModel.updateOne(
    { userId: userId },
    {
      visibleProperties: options,
    }
  );

  if (updateResult.matchedCount === 0) {
    return { statusCode: 404, message: "User not found." };
  }

  return {
    statusCode: 200,
    message: "Visible properties updated successfully.",
  };
};

/**
 * Updates the profile picture of the specified user.
 *
 * @param userId - The id of the user to update.
 *
 * @param image - The new profile picture.
 */
export const updateProfilePicture = async (
  userId: number,
  image: { imageBuffer: Buffer; filename: string }
): Promise<UserServiceResult> => {
  const user = await userModel.findOne({ userId: userId });

  if (!user) {
    return {
      statusCode: 404,
      message: "User not found.",
    };
  }

  const previousProfilePicture = user.profilePicture;
  const storageResult = await storeImage(image);
  const storedImage = storageResult.image;

  if (!storedImage) {
    return storageResult;
  }

  if (!previousProfilePicture.isDefault) {
    deleteImage(user.profilePicture);
  }

  await userModel.updateOne(
    { userId: userId },
    {
      profilePicture: storedImage,
    }
  );

  user.profilePicture = storedImage;
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
