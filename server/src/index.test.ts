import { app } from "./start";
import SuperTest from "supertest";
import { users } from "./service/user.service";

const dummyUsername = "username";
const dummyPassword = "password";
const dummyEmail = "email@email.com";
const dummyDateOfBirth = new Date(1972, 11, 10);

// Clear users before each test.
beforeEach(async () =>
  Object.keys(users).forEach((username) => delete users[username])
);

test("Registering a user and then GETing that user should return the user.", async () => {
  const request = SuperTest(app);

  const registrationResult = await request.post("/user/register").send({
    username: dummyUsername,
    email: dummyEmail,
    password: dummyPassword,
    birthDate: dummyDateOfBirth,
  });

  if (registrationResult.status !== 201)
    throw new Error("Registration failed.");

  const getResult = await request.get(`/user/${dummyUsername}`);

  expect(getResult.status).toBe(200);

  const receivedUser = getResult.body.user;

  expect(receivedUser.username).toBe(dummyUsername);
});

test("After editing a users password, sign in only works with the new pw.", async () => {
  const request = SuperTest(app);
  const newPassword = "newPassword";

  await request.post("/user/register").send({
    username: dummyUsername,
    email: dummyEmail,
    password: dummyPassword,
    birthDate: dummyDateOfBirth,
  });

  await request.put("/user/update-user").send({
    username: dummyUsername,
    password: dummyPassword,
    newPassword: newPassword,
  });

  const [originalPasswordResult, newPasswordResult] = await Promise.all([
    request
      .post("/user/sign-in")
      .send({ username: dummyUsername, password: dummyPassword }),
    request
      .post("/user/sign-in")
      .send({ username: dummyUsername, password: newPassword }),
  ]);

  expect(originalPasswordResult.status).toBe(401);
  expect(originalPasswordResult.body.user).toBeUndefined();

  expect(newPasswordResult.status).toBe(200);
  expect(newPasswordResult.body.user).toBeDefined();
});

test("Sign in fails with 404 after a user has been deleted.", async () => {
  const request = SuperTest(app);

  await request.post("/user/register").send({
    username: dummyUsername,
    email: dummyEmail,
    password: dummyPassword,
    birthDate: dummyDateOfBirth,
  });

  const deleteResult = await request.delete("/user/delete-user").send({
    username: dummyUsername,
    password: dummyPassword,
  });

  expect(deleteResult.status).toBe(200);

  const signInResult = await request
    .post("/user/sign-in")
    .send({ username: dummyUsername, password: dummyPassword });

  expect(signInResult.status).toBe(404);
  expect(signInResult.body.user).toBeUndefined();
});
