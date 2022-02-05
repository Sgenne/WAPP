import { register, signIn } from "../user.service";

const dummyUsername = "¯_(ツ)_/¯";
const dummyPassword = "password";
const dummyEmail = "email@email.com";
const dummyDateOfBirth = new Date(1972, 11, 10);

test("Sign in fails if no user with the given username exists.", async () => {
  const result = await signIn(dummyUsername, dummyPassword);

  expect(result.user).toBeUndefined;
  expect(result.statusCode).toBe(404);
});

test("Sign in succeeds if the correct username and password is provided.", async () => {
  await register(dummyEmail, dummyUsername, dummyPassword, dummyDateOfBirth);

  const result = await signIn(dummyUsername, dummyPassword);
  if (!result.user) throw new Error("User is undefined.");

  expect(result.user.email).toBe(dummyEmail);
  expect(result.user.username).toBe(dummyUsername);
  expect(result.user.birthDate).toBe(dummyDateOfBirth);
  expect(result.statusCode).toBe(200);
});

test("Sign in fails if the username exists but the password is incorrect.", async () => {
  await register(dummyEmail, dummyUsername, dummyPassword, dummyDateOfBirth);

  const result = await signIn(dummyUsername, "passsssword");

  expect(result.user).toBeUndefined();
  expect(result.statusCode).toBe(401);
});

