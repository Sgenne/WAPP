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

import { register, signIn, users } from "../user.service";

const dummyUsername = "¯_(ツ)_/¯";
const dummyCategory = "gaming";
const dummyTitle = "Will we succed tonight";
const dummyContent = ":)";
const dummyPassword = "password";
const dummyEmail = "email@email.com";
const dummyDateOfBirth = new Date(1972, 11, 10);

// Clear users before each test.
beforeEach(async () =>
  Object.keys(threads).forEach((threadId) => delete threads[threadId])
);
beforeEach(async () =>
  Object.keys(users).forEach((username) => delete users[username])
);
beforeEach(async () =>
  categories.forEach((category, index) => delete categories[index])
);

/*
  ================================
  postThread
  ================================
  */
test("Create thread succeds if username, category, title and content is provided.", async () => {
  await register(dummyEmail, dummyUsername, dummyPassword, dummyDateOfBirth);
  categories.push(dummyCategory);
  const result = await postThread(
    dummyUsername,
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

test("Create thread fails if no user with the given username exists.", async () => {
  categories.push(dummyCategory);
  const result = await postThread(
    dummyUsername,
    dummyCategory,
    dummyTitle,
    dummyContent
  );

  if (!result.thread) throw new Error("Thread is undefined.");

  expect(result.thread).toBeUndefined;
  expect(result.statusCode).toBe(400);
});

test("Create thread fails if given category does not exists.", async () => {
  await register(dummyEmail, dummyUsername, dummyPassword, dummyDateOfBirth);

  const result = await postThread(
    dummyUsername,
    dummyCategory,
    dummyTitle,
    dummyContent
  );

  if (!result.thread) throw new Error("Thread is undefined.");

  expect(result.thread).toBeUndefined;
  expect(result.statusCode).toBe(400);
});

/*
  ================================
  editThread
  ================================
  */
test("Editing an existing thread with the correct variables succeeds.", async () => {
  await register(dummyEmail, dummyUsername, dummyPassword, dummyDateOfBirth);
  categories.push(dummyCategory);
  const thread = await postThread(
    dummyUsername,
    dummyCategory,
    dummyTitle,
    dummyContent
  );
  if (thread.thread?.threadId === undefined)
    throw new Error("Thread is undefined.");

  const result = await editThread(
    thread.thread.threadId,
    "凸༼ຈل͜ຈ༽凸",
    "Lenny faces uwu"
  );
  if (!result.thread) throw new Error("Thread is undefined.");

  expect(result.thread.author.username).toBe(dummyUsername);
  expect(result.thread.category).toBe(dummyCategory);
  expect(result.thread.title).toBe("Lenny faces uwu");
  expect(result.thread.content).toBe("凸༼ຈل͜ຈ༽凸");
  expect(result.statusCode).toBe(200);
});

test("Attempting to edit a thread that doesn't exist fails.", async () => {
  await register(dummyEmail, dummyUsername, dummyPassword, dummyDateOfBirth);
  categories.push(dummyCategory);

  const result = await editThread(100, "凸༼ຈل͜ຈ༽凸", "Lenny faces uwu");
  if (!result.thread) throw new Error("Thread is undefined.");

  expect(result.statusCode).toBe(400);
});

/*
  ================================
  likeThread
  ================================
  */

test("Liking thread succeeds if the thread exists and the user exists", async () => {
  const user = await register(
    dummyEmail,
    dummyUsername,
    dummyPassword,
    dummyDateOfBirth
  );
  categories.push(dummyCategory);
  const thread = await postThread(
    dummyUsername,
    dummyCategory,
    dummyTitle,
    dummyContent
  );
  if (thread.thread?.threadId === undefined)
    throw new Error("Thread is undefined.");
  if (user.user?.username === undefined) throw new Error("User is undefined.");

  const result = await likeThread(thread.thread.threadId, user.user?.username);
  if (!result.thread) throw new Error("Thread is undefined.");

  expect(result.thread.author.username).toBe(dummyUsername);
  expect(result.thread.category).toBe(dummyCategory);
  expect(result.thread.title).toBe(dummyTitle);
  expect(result.thread.content).toBe(dummyContent);
  expect(result.thread.likes).toBe(1);
  expect(result.statusCode).toBe(200);
  expect(user.user.likedThreads.includes(result.thread)).toBe(true);
});

test("Liking an already disliked thread succeeds if the thread exists and the user exists, also make sure that the dislike is removed", async () => {
  const user = await register(
    dummyEmail,
    dummyUsername,
    dummyPassword,
    dummyDateOfBirth
  );
  categories.push(dummyCategory);
  const thread = await postThread(
    dummyUsername,
    dummyCategory,
    dummyTitle,
    dummyContent
  );
  if (thread.thread?.threadId === undefined)
    throw new Error("Thread is undefined.");
  if (user.user?.username === undefined) throw new Error("User is undefined.");
  const result = await disLikeThread(thread.thread.threadId, user.user?.username);
  if (!result.thread) throw new Error("Thread is undefined.");
  expect(user.user.dislikedThreads.includes(result.thread)).toBe(true);
  expect(user.user.likedThreads.includes(result.thread)).toBe(false);

  const result2 = await likeThread(thread.thread.threadId, user.user?.username);
  if (!result2.thread) throw new Error("Thread is undefined.");
  expect(user.user.likedThreads.includes(result.thread)).toBe(true);
  expect(user.user.dislikedThreads.includes(result.thread)).toBe(false);

  expect(result.statusCode).toBe(200);
  
});

/*
  ================================
  dislikeThread
  ================================
  */

test("Registering a user with an occupied username fails", async () => {
  const user = await register(
    dummyEmail,
    dummyUsername,
    dummyPassword,
    dummyDateOfBirth
  );
  categories.push(dummyCategory);
  const thread = await postThread(
    dummyUsername,
    dummyCategory,
    dummyTitle,
    dummyContent
  );
  if (thread.thread?.threadId === undefined)
    throw new Error("Thread is undefined.");
  if (user.user?.username === undefined) throw new Error("User is undefined.");

  const result = await disLikeThread(
    thread.thread.threadId,
    user.user?.username
  );
  if (!result.thread) throw new Error("Thread is undefined.");

  expect(result.thread.author.username).toBe(dummyUsername);
  expect(result.thread.category).toBe(dummyCategory);
  expect(result.thread.title).toBe(dummyTitle);
  expect(result.thread.content).toBe(dummyContent);
  expect(result.thread.dislikes).toBe(1);
  expect(result.statusCode).toBe(200);
  expect(user.user.dislikedThreads.includes(result.thread)).toBe(true);
});

test("Disliking an already liked thread succeeds if the thread exists and the user exists, also make sure that the like is removed", async () => {
  const user = await register(
    dummyEmail,
    dummyUsername,
    dummyPassword,
    dummyDateOfBirth
  );
  categories.push(dummyCategory);
  const thread = await postThread(
    dummyUsername,
    dummyCategory,
    dummyTitle,
    dummyContent
  );
  if (thread.thread?.threadId === undefined)
    throw new Error("Thread is undefined.");
  if (user.user?.username === undefined) throw new Error("User is undefined.");
  const result = await likeThread(thread.thread.threadId, user.user?.username);
  if (!result.thread) throw new Error("Thread is undefined.");
  expect(user.user.dislikedThreads.includes(result.thread)).toBe(false);
  expect(user.user.likedThreads.includes(result.thread)).toBe(true);

  const result2 = await disLikeThread(thread.thread.threadId, user.user?.username);
  if (!result2.thread) throw new Error("Thread is undefined.");
  expect(user.user.likedThreads.includes(result.thread)).toBe(false);
  expect(user.user.dislikedThreads.includes(result.thread)).toBe(true);

  expect(result.statusCode).toBe(200);
});

/*
  ================================
  commentThread
  ================================
  */

test("Registering a user with an occupied username fails", async () => {
  const user = await register(
    dummyEmail,
    dummyUsername,
    dummyPassword,
    dummyDateOfBirth
  );
  categories.push(dummyCategory);
  const thread = await postThread(
    dummyUsername,
    dummyCategory,
    dummyTitle,
    dummyContent
  );
  if (thread.thread?.threadId === undefined)
    throw new Error("Thread is undefined.");
  if (user.user?.username === undefined) throw new Error("User is undefined.");

  const result = await commentThread(
    user.user.username,
    thread.thread.threadId,
    "Markus was here hehe"
  );
  if (!result.thread) throw new Error("Thread is undefined.");

  expect(result.thread.replies.length).toBe(1);
  expect(result.thread.replies[0].content).toBe("Markus was here hehe");
  expect(result.thread.replies[0].authour).toBe(user.user);
  expect(result.statusCode).toBe(200);
});

/*
  ================================
  deleteThread
  ================================
  */

test("After deleting a user, that user is no longer stored.", async () => {
  await register(dummyEmail, dummyUsername, dummyPassword, dummyDateOfBirth);
  categories.push(dummyCategory);
  const thread = await postThread(
    dummyUsername,
    dummyCategory,
    dummyTitle,
    dummyContent
  );
  if (thread.thread?.threadId === undefined)
    throw new Error("Thread is undefined.");
  const id = thread.thread.threadId;
  const result = await deleteThread(thread.thread.threadId);

  expect(threads[id]).toBe(undefined);
  expect(result.statusCode).toBe(200);
});
