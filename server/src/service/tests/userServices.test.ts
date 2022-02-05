import {
  updateUser,
  register,
  signIn,
  users,
  deleteUser,
} from "../user.service";

const dummyUsername = "¯_(ツ)_/¯";
const dummyPassword = "password";
const dummyEmail = "email@email.com";
const dummyDateOfBirth = new Date(1972, 11, 10);

// Clear users before each test.
beforeEach(async () =>
  Object.keys(users).forEach((username) => delete users[username])
);

/*
================================
signIn
================================
*/

test("Sign in succeeds if the correct username and password is provided.", async () => {
  await register(dummyEmail, dummyUsername, dummyPassword, dummyDateOfBirth);

  const result = await signIn(dummyUsername, dummyPassword);
  if (!result.user) throw new Error("User is undefined.");

  expect(result.user.email).toBe(dummyEmail);
  expect(result.user.username).toBe(dummyUsername);
  expect(result.user.birthDate).toBe(dummyDateOfBirth);
  expect(result.statusCode).toBe(200);
});

test("Sign in fails if no user with the given username exists.", async () => {
  const result = await signIn(dummyUsername, dummyPassword);

  expect(result.user).toBeUndefined;
  expect(result.statusCode).toBe(404);
});

test("Sign in fails if the username exists but the password is incorrect.", async () => {
  await register(dummyEmail, dummyUsername, dummyPassword, dummyDateOfBirth);

  const result = await signIn(dummyUsername, "passsssword");

  expect(result.user).toBeUndefined();
  expect(result.statusCode).toBe(401);
});

/*
================================
updateUser
================================
*/

test("Editing an existing user with the correct password succeeds.", async () => {
  await register(dummyEmail, dummyUsername, dummyPassword, dummyDateOfBirth);

  const update = {
    birthDate: new Date(1996, 8, 26),
    password: "newPassword",
    bio: "biobio",
  };

  const updateResult = await updateUser(dummyUsername, dummyPassword, update);
  const signInResult = await signIn(dummyUsername, update.password);
  if (!updateResult.user) throw new Error("User was undefined.");

  expect(updateResult.statusCode).toBe(200);
  expect(updateResult.user.username).toBe(dummyUsername);
  expect(updateResult.user.birthDate).toBe(update.birthDate);
  expect(updateResult.user.bio).toBe(update.bio);
  expect(signInResult.statusCode).toBe(200);
});

test("Attempting to edit a user that doesn't exist fails.", async () => {
  const update = {
    birthDate: dummyDateOfBirth,
    password: dummyPassword,
    bio: "(ง^ᗜ^)ง",
  };

  const result = await updateUser(dummyUsername, dummyPassword, update);

  expect(result.user).toBeUndefined();
  expect(result.statusCode).toBe(404);
});

test("Attempting to edit an existing user with an incorrect password fails.", async () => {
  await register(dummyEmail, dummyUsername, dummyPassword, dummyDateOfBirth);

  const update = {
    birthDate: new Date(1996, 8, 26),
    bio: "ಠ_ಠ",
    password: "new password",
  };

  const result = await updateUser(dummyUsername, "wrongPassword", update);

  expect(result.statusCode).toBe(401);
  expect(result.user).toBeUndefined();
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
  await register(dummyEmail, dummyUsername, dummyPassword, dummyDateOfBirth);

  const existingUser = users[dummyUsername];

  await deleteUser(dummyUsername, dummyPassword);

  const deletedUser = users[dummyUsername];

  expect(existingUser).toBeDefined();
  expect(deletedUser).toBeUndefined();
});

test("Deleting a user while providing an incorrect password fails.", async () => {
  await register(dummyEmail, dummyUsername, dummyPassword, dummyDateOfBirth);

  const result = await deleteUser(dummyUsername, "(° ͜ʖ°)");

  expect(result.statusCode).toBe(401);
  expect(result.user).toBeUndefined();
});
