import { Console } from "console";
import mongoose from "mongoose";
import "dotenv/config";
import { categoryModel } from "../../db/category.db";
import { commentModel } from "../../db/comment.db";
import { threadModel } from "../../db/thread.db";
import { userModel } from "../../db/user.db";
import { Category } from "../../model/category.interface";
import { getComment } from "../comment.service";
import {
  likeThread,
  disLikeThread,
  editThread,
  commentThread,
  deleteThread,
  postThread,
  getThread,
} from "../thread.service";
import { register, getUser } from "../user.service";
import { connectToDb } from "../../db/connection";

const dummyUsername = "¯_(ツ)_/¯";
const dummyTitle = "Will we succed tonight";
const dummyContent = ":)";
const dummyPassword = "password";
const dummyEmail = "email@email.com";
const dummyDateOfBirth = new Date(1972, 11, 10);


beforeAll(async () => {
  await connectToDb();
});

beforeEach(async () => {
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
  categoryModel.create(category);

  return category.title;
}

/*
  ================================
  postThread
  ================================
  */
test("Create thread succeds if username, category, title and content is provided.", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const result = await postThread(userId, category, dummyTitle, dummyContent);

  if (!result.thread) throw new Error("User is undefined.");

  expect(result.thread.author).toBe(userId);
  expect(result.thread.category).toBe(category);
  expect(result.thread.title).toBe(dummyTitle);
  expect(result.thread.content).toBe(dummyContent);
  expect(result.statusCode).toBe(201);
});

test("Create thread fails if given category does not exists.", async () => {
  const userId = await userSetup();
  const result = await postThread(userId, "dummy", dummyTitle, dummyContent);

  expect(result.thread).toBeUndefined;
  expect(result.statusCode).toBe(400);
});

/*
  ================================
  getThread
  ================================
  */
test("Get thread succeds if given id exists.", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);
  console.log(threadId);
  const result = await getThread(threadId);

  expect(result.statusCode).toBe(200); //gets 404
});

// test("Create thread fails if given id does not exists.", async () => {
//   const result = await getThread(0);

//   expect(result.thread).toBeUndefined;
//   expect(result.statusCode).toBe(404);
// });

/*
  ================================
  editThread
  ================================
  */
// test("Editing an existing thread with the correct variables succeeds.", async () => {
//   const userId = await userSetup();
//   const category = await categorySetup();
//   const threadId = await threadSetup(userId);

//   const result = await editThread(threadId, "凸༼ຈل͜ຈ༽凸", "Lenny faces uwu");
//   if (!result.thread) throw new Error("Thread is undefined.");

//   expect(result.thread.author).toBe(userId);
//   expect(result.thread.category).toBe(category);
//   expect(result.thread.title).toBe("Lenny faces uwu");
//   expect(result.thread.content.includes("凸༼ຈل͜ຈ༽凸")).toBe(true);
//   expect(result.thread.content.includes("edited")).toBe(true);
//   expect(result.statusCode).toBe(200);
// });

// test("Attempting to edit a thread that doesn't exist fails.", async () => {
//   await userSetup();
//   const category = await categorySetup();

//   const result = await editThread(100, "凸༼ຈل͜ຈ༽凸", "Lenny faces uwu");
//   expect(result.thread).toBeUndefined;
//   expect(result.statusCode).toBe(404);
// });

/*
  ================================
  likeThread
  ================================
  */

// test("Liking thread succeeds if the thread exists and the user exists", async () => {
//   const userId = await userSetup();
//   const category = await categorySetup();
//   const threadId = await threadSetup(userId);

//   const likeResult = await likeThread(threadId, userId);
//   if (!likeResult.thread) throw new Error("Thread is undefined.");

//   const user = (await getUser(userId)).user;
//   if (!user) throw new Error("Unable to fetch user");

//   expect(likeResult.thread.author).toBe(userId);
//   expect(likeResult.thread.category).toBe(category);
//   expect(likeResult.thread.title).toBe(dummyTitle);
//   expect(likeResult.thread.content).toBe(dummyContent);
//   expect(likeResult.thread.likes).toBe(1);
//   expect(likeResult.statusCode).toBe(200);
//   expect(user.likedThreads.includes(likeResult.thread.threadId)).toBe(true);
// });

// test("Liking an already disliked thread succeeds if the thread exists and the user exists, also make sure that the dislike is removed", async () => {
//   const userId = await userSetup();
//   const category = await categorySetup();
//   const threadId = await threadSetup(userId);

//   const user = (await getUser(userId)).user;
//   if (!user) throw new Error("Unable to fetch user");

//   await disLikeThread(threadId, userId);

//   expect(user.dislikedThreads.includes(threadId)).toBe(true);
//   expect(user.likedThreads.includes(threadId)).toBe(false);

//   await likeThread(threadId, userId);

//   expect(user.likedThreads.includes(threadId)).toBe(true);
//   expect(user.dislikedThreads.includes(threadId)).toBe(false);
// });

// test("Liking an already liked thread removes the previous like", async () => {
//   const userId = await userSetup();
//   const category = await categorySetup();
//   const threadId = await threadSetup(userId);

//   const user = (await getUser(userId)).user;
//   if (!user) throw new Error("Unable to fetch user");

//   await likeThread(threadId, userId);

//   expect(user.likedThreads.includes(threadId)).toBe(true);

//   await likeThread(threadId, userId);

//   expect(user.likedThreads.includes(threadId)).toBe(false);
// });

/*
  ================================
  dislikeThread
  ================================
  */

// test("Disliking a thread adds that thread to the users list of disliked threads.", async () => {
//   const userId = await userSetup();
//   const category = await categorySetup();
//   const threadId = await threadSetup(userId);

//   await disLikeThread(threadId, userId);

//   const user = (await getUser(userId)).user;
//   if (!user) throw new Error("Unable to fetch user");

//   const thread = (await getThread(threadId)).thread;
//   if (!thread) throw new Error("Unable to fetch Thread");

//   expect(thread.dislikes).toBe(1);
//   expect(user.dislikedThreads.includes(thread.threadId)).toBe(true);
// });

// test("Disliking an already liked thread succeeds if the thread exists and the user exists, also make sure that the like is removed", async () => {
//   const userId = await userSetup();
//   const category = await categorySetup();
//   const threadId = await threadSetup(userId);

//   await likeThread(threadId, userId);

//   const user = (await getUser(userId)).user;
//   if (!user) throw new Error("Unable to fetch user");

//   expect(user.dislikedThreads.includes(threadId)).toBe(false);
//   expect(user.likedThreads.includes(threadId)).toBe(true);

//   await disLikeThread(threadId, userId);

//   expect(user.likedThreads.includes(threadId)).toBe(false);
//   expect(user.dislikedThreads.includes(threadId)).toBe(true);
// });

// test("Disliking an already disliked thread removes the previous dislike", async () => {
//   const userId = await userSetup();
//   const category = await categorySetup();
//   const threadId = await threadSetup(userId);

//   const user = (await getUser(userId)).user;
//   if (!user) throw new Error("Unable to fetch user");

//   await disLikeThread(threadId, userId);

//   expect(user.dislikedThreads.includes(threadId)).toBe(true);

//   await disLikeThread(threadId, userId);

//   expect(user.dislikedThreads.includes(threadId)).toBe(false);
// });

/*
  ================================
  commentThread
  ================================
  */

// test("Commenting on a thread with a vaild user succeds", async () => {
//   const userId = await userSetup();
//   const category = await categorySetup();
//   const threadId = await threadSetup(userId);

//   const commentResult = await commentThread(
//     userId,
//     threadId,
//     "Markus was here hehe"
//   );
//   if (!commentResult.thread) throw new Error("Thread is undefined.");

//   const comment = (await getComment(commentResult.thread.replies[0])).comment;
//   if (!comment) throw new Error("Unable to fetch comment");

//   expect(commentResult.thread.replies.length).toBe(1);
//   expect(comment.content).toBe("Markus was here hehe");
//   expect(comment.author).toBe(userId);
//   expect(commentResult.statusCode).toBe(201);
// });

/*
  ================================
  deleteThread
  ================================
  */

// test("After deleting a user, that user is no longer stored.", async () => {
//   const userId = await userSetup();
//   const category = await categorySetup();
//   const threadId = await threadSetup(userId);
//   const result = await deleteThread(threadId, userId);
//   const getResult = await getThread(threadId);

//   expect(getResult.thread).toBeUndefined();
//   expect(result.statusCode).toBe(200);
// });
