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

  const userId = registrationResult.body.user.userId;

  if (registrationResult.status !== 201)
    throw new Error("Registration failed.");

  const getResult = await request.get(`/user/${userId}`);

  expect(getResult.status).toBe(200);

  const receivedUser = getResult.body.user;

  expect(receivedUser.username).toBe(dummyUsername);
});

test("After editing a users password, only the new password is valid.", async () => {
  const request = SuperTest(app);
  const newPassword = "newPassword";

  const registrationResult = await request.post("/user/register").send({
    username: dummyUsername,
    email: dummyEmail,
    password: dummyPassword,
    birthDate: dummyDateOfBirth,
  });

  const userId = registrationResult.body.user.userId;

  await request.put("/user/update-user").send({
    userId: userId,
    password: dummyPassword,
    newPassword: newPassword,
  });

  const [originalPasswordResult, newPasswordResult] = await Promise.all([
    request
      .post("/user/validate-password")
      .send({ userId: userId, password: dummyPassword }),
    request
      .post("/user/validate-password")
      .send({ userId: userId, password: newPassword }),
  ]);

  expect(originalPasswordResult.status).toBe(401);
  expect(originalPasswordResult.body.user).toBeUndefined();

  expect(newPasswordResult.status).toBe(200);
});

test("GETing a user fails with 404 after that user has been deleted.", async () => {
  const request = SuperTest(app);

  const registerResult = await request.post("/user/register").send({
    username: dummyUsername,
    email: dummyEmail,
    password: dummyPassword,
    birthDate: dummyDateOfBirth,
  });

  const userId = registerResult.body.user.userId;

  const deleteResult = await request.delete("/user/delete-user").send({
    userId: userId,
    password: dummyPassword,
  });

  expect(deleteResult.status).toBe(200);

  const getResult = await request.get("/user/" + userId).send();

  expect(getResult.status).toBe(404);
  expect(getResult.body.user).toBeUndefined();
});
