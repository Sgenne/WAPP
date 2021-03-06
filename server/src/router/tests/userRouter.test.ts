import SuperTest from "supertest";
import { app } from "../../start";
import { register } from "../../service/user.service";
import { clearTestDB, closeTestDB, startTestDB } from "../../setupTests";
import { Image } from "../../model/image.interface";
import path from "path";

jest.mock("../../imageStorage/image.storage", () => {
  return {
    imageStorage: {
      storeImage: async (): Promise<Image> => ({
        imageUrl: "http://fake-url.com/theImage.jpeg",
        filename: "theImage.jpeg",
      }),
      deleteImage: async (image: Image): Promise<void> => {},
    },
  };
});

const dummyUsername = "username";
const dummyPassword = "password";
const dummyEmail = "email@email.com";
const dummyDateOfBirth = new Date(1972, 11, 10);

async function userSetup(): Promise<number> {
  const registerResult = await register(
    dummyEmail,
    dummyUsername,
    dummyPassword,
    dummyDateOfBirth
  );

  if (!registerResult.user) throw new Error("Registration failed.");

  return registerResult.user.userId;
}

beforeAll(async () => {
  await startTestDB();
});

beforeEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

test("Registering a user with an occupied username results in status code 403.", async () => {
  const request = SuperTest(app);

  await request.post("/user/register").send({
    username: dummyUsername,
    email: dummyEmail,
    password: dummyPassword,
    birthDate: dummyDateOfBirth,
  });

  const registrationResult = await request.post("/user/register").send({
    username: dummyUsername,
    email: "email2@email.com",
    password: "thisisthepassword",
    birthDate: new Date(2000, 1, 1),
  });

  expect(registrationResult.status).toBe(403);
  expect(registrationResult.body.user).toBeUndefined();
});

test("Deleting a user returns a status code of 200", async () => {
  const request = SuperTest(app);

  const userId = await userSetup();

  const deleteResult = await request.delete("/user/delete-user").send({
    userId: userId,
    password: dummyPassword,
  });

  expect(deleteResult.status).toBe(200);
  expect(deleteResult.body.user).toBeUndefined();
});

test("Registering a user with an occupied username results in status code 403.", async () => {
  const request = SuperTest(app);

  const userId = await userSetup();

  const registrationResult = await request.put("/user/update-user").send({
    userId: userId,
    password: dummyPassword,
    birthDate: new Date(),
    email: "hejsan@SourceMap.com",
  });

  expect(registrationResult.status).toBe(200); //TODO get user and check properties
});

test("Signing into a user returns a status code of 200", async () => {
  const request = SuperTest(app);

  const userId = await userSetup();

  const signInResult = await request.post("/user/sign-in").send({
    username: dummyUsername,
    password: dummyPassword,
  });

  expect(signInResult.status).toBe(200);
  expect(signInResult.body.user.userId).toBe(userId);
});

test("Signing into a user who doesn't exist returns a status code of 404", async () => {
  const request = SuperTest(app);

  await userSetup();

  const signInResult = await request.post("/user/sign-in").send({
    username: "dummyUsername",
    password: dummyPassword,
  });

  expect(signInResult.status).toBe(404);
  expect(signInResult.body.user).toBeUndefined;
});

test("Signing into a user with an invalid password returns a status code of 403", async () => {
  const request = SuperTest(app);

  await userSetup();

  const signInResult = await request.post("/user/sign-in").send({
    username: dummyUsername,
    password: "dummyPassword",
  });

  expect(signInResult.status).toBe(401);
  expect(signInResult.body.user).toBeUndefined;
});

test("Uploading an existing image returns a statuscode of 200", async () => {
  const request = SuperTest(app);

  const userId = await userSetup();

  const result = await request
    .post("/user/upload-profile-picture")
    .attach("image", path.resolve(__dirname, "testPicture.jpg"))
    .field("userId", userId)
    .field("password", dummyPassword);

  expect(result.status).toBe(200);
  expect(result.body.user).toBeUndefined;
});

test("Getting a user with its userId returns a status code of 200", async () => {
  const request = SuperTest(app);

  const userId = await userSetup();

  const signInResult = await request.get(`/user/${userId}`).send({
    userId: userId,
  });

  expect(signInResult.status).toBe(200);
  expect(signInResult.body.user.userId).toBe(userId);
});

test("Getting a user with its username returns a status code of 200", async () => {
  const request = SuperTest(app);

  const userId = await userSetup();

  const signInResult = await request
    .get(`/user/username/${dummyUsername}`)
    .send({
      username: dummyUsername,
    });

  expect(signInResult.status).toBe(200);
  expect(signInResult.body.user.username).toBe(dummyUsername);
});
