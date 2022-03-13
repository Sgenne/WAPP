import mongoose from "mongoose";
import { categoryModel } from "../../db/category.db";
import { commentModel } from "../../db/comment.db";
import { connectToDbTest } from "../../db/connectiontest";
import { threadModel } from "../../db/thread.db";
import { userModel } from "../../db/user.db";
import { Category } from "../../model/category.interface";
import { postThread } from "../../service/thread.service";
import { register } from "../../service/user.service";
import SuperTest from "supertest";
import { app } from "../../start";

const dummyUsername = "¯_(ツ)_/¯";
const dummyTitle = "Will we succed tonight";
const dummyContent = ":)";
const dummyPassword = "password";
const dummyEmail = "email@email.com";
const dummyDateOfBirth = new Date(1972, 11, 10);

beforeAll(async () => {
  await connectToDbTest();
});

beforeEach(async () => {
  jest.setTimeout(8000);
  await threadModel.deleteMany({});
  await commentModel.deleteMany({});
  await userModel.deleteMany({});
  await categoryModel.deleteMany({});
});

afterAll(async () => {
  await threadModel.deleteMany({});
  await commentModel.deleteMany({});
  await userModel.deleteMany({});
  await categoryModel.deleteMany({});
  await mongoose.connection.close();
});

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

async function threadSetup(userId: number): Promise<number> {
  const threadres = await postThread(userId, "dummy", dummyTitle, dummyContent);

  if (!threadres.thread) throw new Error("Thread failed");
  return threadres.thread.threadId;
}

async function categorySetup(): Promise<string> {
  const category: Category = {
    title: "dummy",
    description: "this is a test",
  };
  await categoryModel.create(category);

  return category.title;
}

test("Registering a user with an occupied username results in status code 403.", async () => {
  const request = SuperTest(app);

  const userId = await userSetup();

  const categoryTitle = await categorySetup();

  const threadPostResult = await request.post("/thread/postThread").send({
    userId: userId,
    password: dummyPassword,
    categoryTitle: categoryTitle,
    title: dummyTitle,
    content: dummyContent,
  });

  expect(threadPostResult.status).toBe(201);
  expect(threadPostResult.body.thread).toBeDefined();
});
