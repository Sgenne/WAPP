import { categoryModel } from "../../db/category.db";
import { Category } from "../../model/category.interface";
import { Thread } from "../../model/thread.interface";
import { User } from "../../model/user.interface";
import { postThread, commentThread } from "../../service/thread.service";
import { register } from "../../service/user.service";
import SuperTest from "supertest";
import { app } from "../../start";
import { clearTestDB, closeTestDB, startTestDB } from "../../setupTests";

const dummyUsername = "¯_(ツ)_/¯";
const dummyCategory = "gaming";
const dummyTitle = "Will we succed tonight";
const dummyContent = ":)";
const dummyCommentContent = "Looks cool";
const dummyPassword = "password";
const dummyEmail = "email@email.com";
const dummyDateOfBirth = new Date(1972, 11, 10);
let user: User;
let thread: Thread;

beforeAll(async () => {
  await startTestDB();
});

beforeEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

beforeEach(async () => {
  user = await userSetup();
  await categorySetup();
  thread = await threadSetup(user.userId);
});

async function categorySetup(): Promise<string> {
  const category: Category = {
    title: dummyCategory,
    description: "this is a test",
  };
  categoryModel.create(category);

  return category.title;
}

async function userSetup(): Promise<User> {
  const registerResult = await register(
    dummyEmail,
    dummyUsername,
    dummyPassword,
    dummyDateOfBirth
  );
  if (!registerResult.user) throw new Error("Registration failed.");
  return registerResult.user;
}

async function threadSetup(userId: number): Promise<Thread> {
  const threadres = await postThread(
    userId,
    dummyCategory,
    dummyTitle,
    dummyContent
  );
  if (!threadres.thread) throw new Error("Thread failed");
  return threadres.thread;
}

async function commentSetup(userId: number, threadId: number): Promise<number> {
  const commentres = await commentThread(userId, threadId, dummyCommentContent);
  if (!commentres.thread) throw new Error("Thread comment failed");
  return commentres.thread.replies[0];
}

test("Commenting on a comment returns a statuscode of 200.", async () => {
  const request = SuperTest(app);

  const comment = await commentSetup(user.userId, thread.threadId);

  const commentReplyResult = await request.post("/comment/reply").send({
    userId: user.userId,
    password: dummyPassword,
    commentID: comment,
    content: dummyContent,
  });

  expect(commentReplyResult.status).toBe(201);
  expect(commentReplyResult.body.comment).toBeDefined();
});
