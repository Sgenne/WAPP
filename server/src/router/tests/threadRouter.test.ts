import { categoryModel } from "../../db/category.db";
import { Category } from "../../model/category.interface";
import { postThread } from "../../service/thread.service";
import { register } from "../../service/user.service";
import SuperTest from "supertest";
import { app } from "../../start";
import { clearTestDB, closeTestDB, startTestDB } from "../../setupTests";

const dummyUsername = "¯_(ツ)_/¯";
const dummyTitle = "Will we succed tonight";
const dummyContent = ":)";
const dummyPassword = "password";
const dummyEmail = "email@email.com";
const dummyDateOfBirth = new Date(1972, 11, 10);

beforeAll(async () => {
  await startTestDB();
});

beforeEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await closeTestDB();
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

async function threadSetup(userId: number, category: string): Promise<number> {
  const threadres = await postThread(
    userId,
    category,
    dummyTitle,
    dummyContent
  );

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
/*
  ================================
  postThread
  ================================
  */

test("Posting a thread as a valid user returns a status of 200.", async () => {
  const request = SuperTest(app);

  const userId = await userSetup();

  const categoryTitle = await categorySetup();

  const threadPostResult = await request.post("/thread/post-thread").send({
    userId: userId,
    password: dummyPassword,
    categoryTitle: categoryTitle,
    title: dummyTitle,
    content: dummyContent,
  });

  expect(threadPostResult.status).toBe(201);
  expect(threadPostResult.body.thread).toBeDefined();
});

test("Replying to a thread as a valid user returns a status of 200.", async () => {
  const request = SuperTest(app);

  const userId = await userSetup();

  const categoryTitle = await categorySetup();

  const thread = await threadSetup(userId, categoryTitle);

  const threadReplyResult = await request.post("/thread/reply").send({
    userId: userId,
    password: dummyPassword,
    threadId: thread,
    content: dummyContent,
  });

  expect(threadReplyResult.status).toBe(201);
  expect(threadReplyResult.body.thread.replies.length).toBe(1);

  const threadReplyResult2 = await request.post("/thread/reply").send({
    userId: userId,
    password: dummyPassword,
    threadId: thread,
    content: dummyContent,
  });

  expect(threadReplyResult2.status).toBe(201);
  expect(threadReplyResult2.body.thread.replies.length).toBe(2);
});

/*
  ================================
  getThread
  ================================
  */

test("Get the threads category returns a status of 200.", async () => {
  const request = SuperTest(app);

  const userId = await userSetup();

  const categoryTitle = await categorySetup();

  const thread = await threadSetup(userId, categoryTitle);

  const categoriesResult = await request
    .get(`/thread/category-threads/${categoryTitle}`)
    .send({});

  expect(categoriesResult.status).toBe(200);
  expect(categoriesResult.body.threads.length).toBe(1);
});

test("Get at max three threads and returns a status of 200.", async () => {
  const request = SuperTest(app);

  const userId = await userSetup();

  const categoryTitle = await categorySetup();

  await threadSetup(userId, categoryTitle);
  await threadSetup(userId, categoryTitle);
  await threadSetup(userId, categoryTitle);
  await threadSetup(userId, categoryTitle);

  const threadsResult = await request
    .get(`/thread/sample-threads/${categoryTitle}`)
    .send({});

  expect(threadsResult.status).toBe(200);
  expect(threadsResult.body.threads.length).toBe(3);
});

test("Get the threads details returns a status of 200.", async () => {
  const request = SuperTest(app);

  const userId = await userSetup();

  const categoryTitle = await categorySetup();

  const threadres = await postThread(
    userId,
    categoryTitle,
    dummyTitle,
    dummyContent
  );
  if (!threadres.thread) throw new Error("Cannot create thread");

  const threadsResult = await request
    .get(`/thread/${threadres.thread.threadId}`)
    .send({
      userId: userId,
      password: dummyPassword,
      threadId: threadres.thread.threadId,
    });

  expect(threadsResult.status).toBe(200);
  expect(threadsResult.body.thread.threadId).toBe(threadres.thread.threadId);
});

test("Get the threads the user has liked and returns a status of 200.", async () => {
  const request = SuperTest(app);

  const userId = await userSetup();

  const categoryTitle = await categorySetup();

  await threadSetup(userId, categoryTitle);
  await threadSetup(userId, categoryTitle);

  const threadsResult = await request.get(`/thread/author/${userId}`).send({});

  expect(threadsResult.status).toBe(200);
  expect(threadsResult.body.threads.length).toBe(2);
});

test("Get the threads the user has liked and returns a status of 200.", async () => {
  const request = SuperTest(app);

  const userId = await userSetup();

  const categoryTitle = await categorySetup();

  const thread = await threadSetup(userId, categoryTitle);

  await threadSetup(userId, categoryTitle);
  await threadSetup(userId, categoryTitle);

  await request.put("/thread/like-thread").send({
    userId: userId,
    password: dummyPassword,
    threadId: thread,
  });

  const threadsResult = await request.get(`/thread/liked/${userId}`).send({});

  expect(threadsResult.status).toBe(200);
  expect(threadsResult.body.threads.length).toBe(1);
});

/*
  ================================
  editThread
  ================================
  */

test("Editing a thread as a valid user returns a status of 200.", async () => {
  const request = SuperTest(app);

  const userId = await userSetup();

  const categoryTitle = await categorySetup();

  const thread = await threadSetup(userId, categoryTitle);
  const threadEditResult = await request.put("/thread/edit-thread").send({
    userId: userId,
    password: dummyPassword,
    threadId: thread,
    content: "dummy",
    title: dummyTitle,
  });
  const today: Date = new Date();
  expect(threadEditResult.status).toBe(200);
  expect(threadEditResult.body.thread.content).toBe(
    "dummy" +
      "\nlast edited " +
      today.getFullYear() +
      "-" +
      today.getMonth() +
      "-" +
      today.getDate()
  );
  expect(threadEditResult.body.thread.title).toBe(dummyTitle);
});

test("Editing a thread as an unathorized user returns a status of 403.", async () => {
  const request = SuperTest(app);

  const userId = await userSetup();
  const user = await request.post("/user/register").send({
    username: "dummyUsername",
    email: "dummyEmail@email.com",
    password: "dummyPassword",
    birthDate: dummyDateOfBirth,
  });

  const categoryTitle = await categorySetup();

  const thread = await threadSetup(userId, categoryTitle);
  const threadEditResult = await request.put("/thread/editThread").send({
    userId: user.body.user.userId,
    password: "dummyPassword",
    threadId: thread,
    content: "dummy",
    title: dummyTitle,
  });
  expect(threadEditResult.status).toBe(404);
});

/*
  ================================
  likeThread
  ================================
  */

test("Liking a thread as a valid user returns a status of 200.", async () => {
  const request = SuperTest(app);

  const userId = await userSetup();

  const categoryTitle = await categorySetup();

  const thread = await threadSetup(userId, categoryTitle);

  const threadLikeResult = await request.put("/thread/like-thread").send({
    userId: userId,
    password: dummyPassword,
    threadId: thread,
  });

  expect(threadLikeResult.status).toBe(200);
  expect(threadLikeResult.body.thread.likes).toBe(1);
});

/*
  ================================
  dislikeThread
  ================================
  */

test("Disliking a thread as a valid user returns a status of 200.", async () => {
  const request = SuperTest(app);

  const userId = await userSetup();

  const categoryTitle = await categorySetup();

  const thread = await threadSetup(userId, categoryTitle);

  const threadDislikeResult = await request.put("/thread/dislike-thread").send({
    userId: userId,
    password: dummyPassword,
    threadId: thread,
  });

  expect(threadDislikeResult.status).toBe(200);
  expect(threadDislikeResult.body.thread.dislikes).toBe(1);
});

/*
  ================================
  deleteThread
  ================================
  */

test("Deletes a thread and returns a status of 200.", async () => {
  const request = SuperTest(app);

  const userId = await userSetup();

  const categoryTitle = await categorySetup();

  const thread = await threadSetup(userId, categoryTitle);

  await threadSetup(userId, categoryTitle);
  await threadSetup(userId, categoryTitle);

  const threadsResult = await request.delete("/thread/delete-thread").send({
    userId: userId,
    password: dummyPassword,
    threadId: thread,
  });

  expect(threadsResult.status).toBe(200);
  expect(threadsResult.body.thread).toBeUndefined();
});

/*
  ================================
  getCategory
  ================================
  */

test("Get all categories returns a status of 200.", async () => {
  const request = SuperTest(app);

  await userSetup();

  await categorySetup();

  const categoriesResult = await request.get("/thread/categories").send({});

  expect(categoriesResult.status).toBe(200);
  expect(categoriesResult.body.categories.length).toBe(1);
});

test("Get the category details returns a status of 200.", async () => {
  const request = SuperTest(app);

  const userId = await userSetup();

  const categoryTitle = await categorySetup();

  const categoryResult = await request
    .get(`/thread/category-details/${categoryTitle}`)
    .send({});

  expect(categoryResult.status).toBe(200);
  expect(categoryResult.body.category.title).toBe(categoryTitle);
});

test("Get the category details returns a status of 200.", async () => {
  const request = SuperTest(app);

  const userId = await userSetup();

  const categoryTitle = await categorySetup();

  const threadId = await threadSetup(userId, categoryTitle);

  await request.post(`/thread/reply/`).send({
    userId: userId,
    password: dummyPassword,
    threadId: threadId,
    content: dummyContent,
  });

  await request.post(`/thread/reply/`).send({
    userId: userId,
    password: dummyPassword,
    threadId: threadId,
    content: dummyContent,
  });

  const threadsResult = await request
    .get(`/thread/thread-comments/${threadId}`)
    .send({});

  expect(threadsResult.status).toBe(200);
  expect(threadsResult.body.comments.length).toBe(2);
});
