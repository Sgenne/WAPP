import {
  categories,
  threads,
  likeThread,
  disLikeThread,
  editThread,
  commentThread,
  deleteThread,
  postThread,
} from "../thread.service";

import { register, users } from "../user.service";

const dummyUsername = "¯_(ツ)_/¯";
const dummyCategory = "gaming";
const dummyTitle = "Will we succed tonight";
const dummyContent = ":)";
const dummyPassword = "password";
const dummyEmail = "email@email.com";
const dummyDateOfBirth = new Date(1972, 11, 10);

// Clear all arrays before each test.
beforeEach(async () => {
  Object.keys(threads).forEach((threadId) => delete threads[threadId]);
  Object.keys(users).forEach((userId) => delete users[userId]);
  categories.forEach((category, index) => delete categories[index]);
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
  const threadres = await postThread(
    userId,
    dummyCategory,
    dummyTitle,
    dummyContent
  );
  if (!threadres.thread) throw new Error("Thread failed");
  return threadres.thread.threadId;
}

/*
  ================================
  postThread
  ================================
  */
test("Create thread succeds if username, category, title and content is provided.", async () => {
  const userId = await userSetup();

  categories.push(dummyCategory);
  const result = await postThread(
    userId,
    dummyCategory,
    dummyTitle,
    dummyContent
  );

  if (!result.thread) throw new Error("User is undefined.");

  expect(result.thread.author.username).toBe(dummyUsername);
  expect(result.thread.category).toBe(dummyCategory);
  expect(result.thread.title).toBe(dummyTitle);
  expect(result.thread.content).toBe(dummyContent);
  expect(result.statusCode).toBe(200);
});

test("Create thread fails if no user with the given user-id exists.", async () => {
  categories.push(dummyCategory);
  const result = await postThread(123, dummyCategory, dummyTitle, dummyContent);

  expect(result.thread).toBeUndefined;
  expect(result.statusCode).toBe(400);
});

test("Create thread fails if given category does not exists.", async () => {
  const userId = await userSetup();

  const result = await postThread(
    userId,
    dummyCategory,
    dummyTitle,
    dummyContent
  );

  expect(result.thread).toBeUndefined;
  expect(result.statusCode).toBe(400);
});

/*
  ================================
  editThread
  ================================
  */
test("Editing an existing thread with the correct variables succeeds.", async () => {
  const userId = await userSetup();
  categories.push(dummyCategory);
  const threadId = await threadSetup(userId);

  const result = await editThread(threadId, "凸༼ຈل͜ຈ༽凸", "Lenny faces uwu");
  if (!result.thread) throw new Error("Thread is undefined.");

  expect(result.thread.author.username).toBe(dummyUsername);
  expect(result.thread.category).toBe(dummyCategory);
  expect(result.thread.title).toBe("Lenny faces uwu");
  expect(result.thread.content.includes("凸༼ຈل͜ຈ༽凸")).toBe(true);
  expect(result.thread.content.includes("edited")).toBe(true);
  expect(result.statusCode).toBe(200);
});

test("Attempting to edit a thread that doesn't exist fails.", async () => {
  await userSetup();
  categories.push(dummyCategory);

  const result = await editThread(100, "凸༼ຈل͜ຈ༽凸", "Lenny faces uwu");
  expect(result.thread).toBeUndefined;
  expect(result.statusCode).toBe(400);
});

/*
  ================================
  likeThread
  ================================
  */

test("Liking thread succeeds if the thread exists and the user exists", async () => {
  const userId = await userSetup();

  categories.push(dummyCategory);
  const threadId = await threadSetup(userId);

  const likeResult = await likeThread(threadId, userId);
  if (!likeResult.thread) throw new Error("Thread is undefined.");

  const user = users[userId];

  expect(likeResult.thread.author.username).toBe(dummyUsername);
  expect(likeResult.thread.category).toBe(dummyCategory);
  expect(likeResult.thread.title).toBe(dummyTitle);
  expect(likeResult.thread.content).toBe(dummyContent);
  expect(likeResult.thread.likes).toBe(1);
  expect(likeResult.statusCode).toBe(200);
  expect(user.likedThreads.includes(likeResult.thread)).toBe(true);
});

test("Liking an already disliked thread succeeds if the thread exists and the user exists, also make sure that the dislike is removed", async () => {
  const userId = await userSetup();
  categories.push(dummyCategory);

  const threadId = await threadSetup(userId);

  const user = users[userId];

  const thread = threads[threadId];

  await disLikeThread(threadId, userId);

  expect(user.dislikedThreads.includes(thread)).toBe(true);
  expect(user.likedThreads.includes(thread)).toBe(false);

  await likeThread(threadId, userId);

  expect(user.likedThreads.includes(thread)).toBe(true);
  expect(user.dislikedThreads.includes(thread)).toBe(false);
});

test("Liking an already liked thread removes the previous like", async () => {
  const userId = await userSetup();
  categories.push(dummyCategory);

  const threadId = await threadSetup(userId);

  const user = users[userId];

  const thread = threads[threadId];

  await likeThread(threadId, userId);

  expect(user.likedThreads.includes(thread)).toBe(true);

  await likeThread(threadId, userId);

  expect(user.likedThreads.includes(thread)).toBe(false);
});

/*
  ================================
  dislikeThread
  ================================
  */

test("Disliking a thread adds that thread to the users list of disliked threads.", async () => {
  const userId = await userSetup();

  categories.push(dummyCategory);

  const threadId = await threadSetup(userId);

  await disLikeThread(threadId, userId);

  const user = users[userId];
  const thread = threads[threadId];

  expect(thread.dislikes).toBe(1);
  expect(user.dislikedThreads.includes(thread)).toBe(true);
});

test("Disliking an already liked thread succeeds if the thread exists and the user exists, also make sure that the like is removed", async () => {
  const userId = await userSetup();

  categories.push(dummyCategory);

  const threadId = await threadSetup(userId);

  await likeThread(threadId, userId);

  const user = users[userId];
  const thread = threads[threadId];

  expect(user.dislikedThreads.includes(thread)).toBe(false);
  expect(user.likedThreads.includes(thread)).toBe(true);

  await disLikeThread(threadId, userId);

  expect(user.likedThreads.includes(thread)).toBe(false);
  expect(user.dislikedThreads.includes(thread)).toBe(true);
});

test("Disliking an already disliked thread removes the previous dislike", async () => {
  const userId = await userSetup();
  categories.push(dummyCategory);

  const threadId = await threadSetup(userId);

  const user = users[userId];
  const thread = threads[threadId];

  await disLikeThread(threadId, userId);

  expect(user.dislikedThreads.includes(thread)).toBe(true);

  await disLikeThread(threadId, userId);

  expect(user.dislikedThreads.includes(thread)).toBe(false);
});

/*
  ================================
  commentThread
  ================================
  */

test("Commenting on a thread with a vaild user succeds", async () => {
  const userId = await userSetup();

  categories.push(dummyCategory);

  const threadId = await threadSetup(userId);

  const commentResult = await commentThread(
    userId,
    threadId,
    "Markus was here hehe"
  );
  if (!commentResult.thread) throw new Error("Thread is undefined.");

  expect(commentResult.thread.replies.length).toBe(1);
  expect(commentResult.thread.replies[0].content).toBe("Markus was here hehe");
  expect(commentResult.thread.replies[0].authour.userId).toBe(userId);
  expect(commentResult.statusCode).toBe(201);
});

/*
  ================================
  deleteThread
  ================================
  */

test("After deleting a user, that user is no longer stored.", async () => {
  const userId = await userSetup();

  categories.push(dummyCategory);

  const threadId = await threadSetup(userId);

  const result = await deleteThread(threadId, userId);

  expect(threads[threadId]).toBeUndefined();
  expect(result.statusCode).toBe(200);
});
