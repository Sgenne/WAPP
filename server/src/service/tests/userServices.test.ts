import mongoose from "mongoose";
import { connectToDbTest } from "../../db/connectiontest";
import { userModel } from "../../db/user.db";
import {
  updateUser,
  register,
  deleteUser,
  validatePassword,
  getUser,
} from "../user.service";

const dummyUsername = "¯_(ツ)_/¯";
const dummyPassword = "password";
const dummyEmail = "email@email.com";
const dummyDateOfBirth = new Date(1972, 11, 10);

// Clear users before each test.
beforeAll(async () => {
  await connectToDbTest();
});

beforeEach(async () => {
  await userModel.deleteMany({});
  jest.setTimeout(8000);
});

afterAll(async () => {
  await userModel.deleteMany({});
  await mongoose.connection.close();
});

/*
================================
updateUser
================================
*/

test("Editing an existing user with the correct password succeeds.", async () => {
  const result = await register(
    dummyEmail,
    dummyUsername,
    dummyPassword,
    dummyDateOfBirth
  );
  if (!result.user) throw new Error("User registration failed.");

  const userId = result.user.userId;

  const update = {
    birthDate: new Date(1996, 8, 26),
    password: "newPassword",
    bio: "biobio",
  };

  const updateResult = await updateUser(userId, update);
  const validationResult = await validatePassword(userId, update.password);
  if (!updateResult.user) throw new Error("User was undefined.");

  expect(updateResult.statusCode).toBe(200);
  expect(updateResult.user.username).toBe(dummyUsername);
  expect(updateResult.user.birthDate).toMatchObject(update.birthDate);
  expect(updateResult.user.bio).toBe(update.bio);
  expect(validationResult.statusCode).toBe(200);
});

test("Attempting to edit a user that doesn't exist fails.", async () => {
  const update = {
    birthDate: dummyDateOfBirth,
    password: dummyPassword,
    bio: "(ง^ᗜ^)ง",
  };

  const result = await updateUser(123, update);

  expect(result.user).toBeUndefined();
  expect(result.statusCode).toBe(404);
});

/*
================================
register
================================
*/

test("Registering a user with an occupied username fails", async () => {
  await register(dummyEmail, dummyUsername, dummyPassword, dummyDateOfBirth);

  const result = await register(
    "newEmail@email.com",
    dummyUsername,
    "(⌐■_■)",
    new Date(1990, 4, 2)
  );

  expect(result.statusCode).toBe(403);
  expect(result.user).toBeUndefined();
});

/*
================================
deleteUser
================================
*/

test("After deleting a user, that user is no longer stored.", async () => {
  const registrationResult = await register(
    dummyEmail,
    dummyUsername,
    dummyPassword,
    dummyDateOfBirth
  );
  if (!registrationResult.user) throw new Error("Registration failed.");

  const userId = registrationResult.user.userId;

  const existingUser = (await getUser(userId)).user;
  expect(existingUser).toBeDefined();

  await deleteUser(userId);

  const deletedUser = (await getUser(userId)).user;
  expect(deletedUser).toBeUndefined();
});
