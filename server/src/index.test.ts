import { app } from "./start";
import SuperTest from "supertest";

/**
 * Integration tests
 */

const dummyUsername = "username";
const dummyPassword = "password";
const dummyEmail = "email@email.com";
const dummyDateOfBirth = new Date(1972, 11, 10);

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
