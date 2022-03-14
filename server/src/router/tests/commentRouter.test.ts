import { categoryModel } from "../../db/category.db";
import { Category } from "../../model/category.interface";
import { Thread } from "../../model/thread.interface";
import { User } from "../../model/user.interface";
import { postThread, commentThread } from "../../service/thread.service";
import { register } from "../../service/user.service";
import SuperTest from "supertest";
import { app } from "../../start";
import { clearTestDB, closeTestDB, startTestDB } from "../../setupTests";
import { getSystemErrorMap } from "util";

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

/**
 * Basic comment function
 */

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

test("Commenting on a comment without proper varibles returns a statuscode of 400.", async () => {
  const request = SuperTest(app);

  const comment = await commentSetup(user.userId, thread.threadId);

  const commentReplyResult = await request.post("/comment/reply").send({
    userId: user.userId,
    password: dummyPassword,
    content: dummyContent,
  });

  expect(commentReplyResult.status).toBe(400);
});

test("Commenting on an invalid comment returns a statuscode of 404.", async () => {
  const request = SuperTest(app);

  const comment = await commentSetup(user.userId, thread.threadId);

  const commentReplyResult = await request.post("/comment/reply").send({
    userId: user.userId,
    password: dummyPassword,
    commentID: 10000,
    content: dummyContent,
  });

  expect(commentReplyResult.status).toBe(404);
});

test("Editing a commment should give status 200", async () => {
  const request = SuperTest(app);

  const comment = await commentSetup(user.userId, thread.threadId);

  const commentReplyResult = await request.put("/comment/edit-comment").send({
    userId: user.userId,
    password: dummyPassword,
    commentID: comment,
    content: "edit",
  });

  expect(commentReplyResult.status).toBe(200);
  expect(commentReplyResult.body.comment).toBeDefined();
});

test("Editing an invalid commment should give status 404", async () => {
  const request = SuperTest(app);

  const comment = await commentSetup(user.userId, thread.threadId);

  const commentReplyResult = await request.put("/comment/edit-comment").send({
    userId: user.userId,
    password: dummyPassword,
    commentID: 0,
    content: "edit",
  });

  expect(commentReplyResult.status).toBe(404);
});

test("Deleting a commment should give status 200", async () => {
  const request = SuperTest(app);

  const comment = await commentSetup(user.userId, thread.threadId);

  const commentReplyResult = await request
    .delete("/comment/delete-comment")
    .send({
      userId: user.userId,
      password: dummyPassword,
      commentID: comment,
    });

  expect(commentReplyResult.status).toBe(200);
  expect(commentReplyResult.body.comment).toBeDefined();
});

test("Deleting an invalid commment should give status 404", async () => {
  const request = SuperTest(app);

  const comment = await commentSetup(user.userId, thread.threadId);

  const commentReplyResult = await request
    .delete("/comment/delete-comment")
    .send({
      userId: user.userId,
      password: dummyPassword,
      commentID: 0,
    });

  expect(commentReplyResult.status).toBe(404);
});

/**
 * Likig comment
 */

test("Clicking like on a comment", async () => {
  const request = SuperTest(app);

  const comment = await commentSetup(user.userId, thread.threadId);

  const commentReplyResult = await request.put("/comment/like-comment").send({
    userId: user.userId,
    password: dummyPassword,
    commentID: comment,
  });

  expect(commentReplyResult.status).toBe(200);
  expect(commentReplyResult.body.comment).toBeDefined();
});

test("Clicking like on a invalid comment", async () => {
  const request = SuperTest(app);

  const comment = await commentSetup(user.userId, thread.threadId);

  const commentReplyResult = await request.put("/comment/like-comment").send({
    userId: user.userId,
    password: dummyPassword,
    commentID: 0,
  });

  expect(commentReplyResult.status).toBe(404);
});

test("Clicking like on a comment", async () => {
  const request = SuperTest(app);

  const comment = await commentSetup(user.userId, thread.threadId);

  const commentReplyResult = await request
    .put("/comment/dislike-comment")
    .send({
      userId: user.userId,
      password: dummyPassword,
      commentID: comment,
    });

  expect(commentReplyResult.status).toBe(200);
  expect(commentReplyResult.body.comment).toBeDefined();
});

test("Clicking like on a invalid comment", async () => {
  const request = SuperTest(app);

  const comment = await commentSetup(user.userId, thread.threadId);

  const commentReplyResult = await request
    .put("/comment/dislike-comment")
    .send({
      userId: user.userId,
      password: dummyPassword,
      commentID: 0,
    });

  expect(commentReplyResult.status).toBe(404);
});

/**
 * Getters
 */

test("Getting a comment should give statuscode 200", async () => {
  const request = SuperTest(app);

  const comment = await commentSetup(user.userId, thread.threadId);

  const commentResult = await request.get("/comment/" + comment);

  expect(commentResult.status).toBe(200);
  expect(commentResult.body.comment).toBeDefined();
});

test("Getting an invalid comment should give statuscode 404", async () => {
  const request = SuperTest(app);

  const comment = await commentSetup(user.userId, thread.threadId);

  const commentResult = await request.get("/comment/000000");

  expect(commentResult.status).toBe(404);
});

test("Getting all liked comments should give statuscode 200", async () => {
  const request = SuperTest(app);

  const comment = await commentSetup(user.userId, thread.threadId);

  await request.put("/comment/dislike-comment").send({
    userId: user.userId,
    password: dummyPassword,
    commentID: comment,
  });

  const commentResult = await request.get(
    "/comment/liked-comments/" + user.userId
  );

  expect(commentResult.status).toBe(200);
  expect(commentResult.body.comments).toBeDefined();
});

test("Getting all comments by an author should give statuscode 200", async () => {
  const request = SuperTest(app);

  const comment = await commentSetup(user.userId, thread.threadId);

  const commentResult = await request.get("/comment/author/" + user.userId);

  expect(commentResult.status).toBe(200);
  expect(commentResult.body.comments).toBeDefined();
});

test("Getting all comments to a comment should give statuscode 200", async () => {
  const request = SuperTest(app);

  const comment = await commentSetup(user.userId, thread.threadId);
  await request.post("/comment/reply").send({
    userId: user.userId,
    password: dummyPassword,
    commentID: comment,
    content: dummyContent,
  });

  const commentResult = await request.get(
    "/comment/comment-comments/" + comment
  );

  expect(commentResult.status).toBe(200);
  expect(commentResult.body.comments).toBeDefined();
});

test("Getting all comments to an invalid comment should give statuscode 404", async () => {
  const request = SuperTest(app);

  const comment = await commentSetup(user.userId, thread.threadId);
  await request.post("/comment/reply").send({
    userId: user.userId,
    password: dummyPassword,
    commentID: comment,
    content: dummyContent,
  });

  const commentResult = await request.get("/comment/comment-comments/000000");

  expect(commentResult.status).toBe(404);
});
