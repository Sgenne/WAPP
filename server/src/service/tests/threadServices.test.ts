import mongoose from "mongoose";
import "dotenv/config";
import { categoryModel } from "../../db/category.db";
import { commentModel } from "../../db/comment.db";
import { threadModel } from "../../db/thread.db";
import { userModel } from "../../db/user.db";
import { Category } from "../../model/category.interface";
import { getComment, postReply } from "../comment.service";
import {
  likeThread,
  disLikeThread,
  editThread,
  commentThread,
  deleteThread,
  postThread,
  getThread,
  getThreadsByAuthor,
  getLikedThreads,
  getCategories,
  getCategoryDetails,
  getSampleThreads,
  getCategoryThreads,
  getThreadComments,
  getCommentComments,
  searchThreads,
} from "../thread.service";
import { register, getUser } from "../user.service";
import { connectToDbTest } from "../../db/connectiontest";

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

test("Create thread fails if given author does not exists.", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const result = await postThread(0, category, dummyTitle, dummyContent);

  expect(result.thread).toBeUndefined;
  expect(result.statusCode).toBe(404);
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
  const result = await getThread(threadId);

  expect(result.statusCode).toBe(200);
});

test("Create thread fails if given id does not exists.", async () => {
  const result = await getThread(0);

  expect(result.thread).toBeUndefined;
  expect(result.statusCode).toBe(404);
});

test("Get thread by author succeds if given id exists.", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);
  const result = await getThreadsByAuthor(userId);
  if (!result.threads) throw new Error("Failed to fetch threads");
  expect(result.threads.length).toBe(1);
  expect(result.statusCode).toBe(200);
});

test("Get thread by author fails if given id doesnt exists.", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);
  const result = await getThreadsByAuthor(0);

  expect(result.statusCode).toBe(404);
});

test("Get liked thread by author succeds if given id exists.", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);
  await likeThread(threadId, userId);
  const result = await getLikedThreads(userId);
  if (!result.threads) throw new Error("Failed to fetch threads");
  expect(result.threads.length).toBe(1);
  expect(result.statusCode).toBe(200);
});

test("Get liked thread by author fails if given id doesnt exists.", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);
  await likeThread(threadId, userId);
  const result = await getLikedThreads(0);

  expect(result.statusCode).toBe(404);
});

test("Get sample threads succeds if given category exists but is limited to 3 threads", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);
  const result = await getSampleThreads(category);
  if (!result.threads) throw new Error("Failed to fetch Threads");

  expect(result.threads.length).toBe(1);
  expect(result.statusCode).toBe(200);

  const threadId2 = await threadSetup(userId);
  const threadId3 = await threadSetup(userId);
  const threadId4 = await threadSetup(userId);

  const result2 = await getSampleThreads(category);
  if (!result2.threads) throw new Error("Failed to fetch Threads");

  expect(result2.threads.length).toBe(3);
  expect(result2.statusCode).toBe(200);
});

test("Get sample threads fails if given category doesnt exists.", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);
  const result = await getSampleThreads("fail");

  expect(result.statusCode).toBe(404);
});

test("Get category threads succeds if given category exists", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);
  const result = await getCategoryThreads(category);
  if (!result.threads) throw new Error("Failed to fetch Threads");

  expect(result.threads.length).toBe(1);
  expect(result.statusCode).toBe(200);

  const threadId2 = await threadSetup(userId);
  const threadId3 = await threadSetup(userId);
  const threadId4 = await threadSetup(userId);

  const result2 = await getCategoryThreads(category);
  if (!result2.threads) throw new Error("Failed to fetch Threads");

  expect(result2.threads.length).toBe(4);
  expect(result2.statusCode).toBe(200);
});

test("Get category threads fails if given category doesnt exists.", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);
  const result = await getCategoryThreads("fail");

  expect(result.statusCode).toBe(404);
});

/*
  ================================
  editThread
  ================================
  */
test("Editing an existing thread with the correct variables succeeds.", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);

  const result = await editThread(threadId, "凸༼ຈل͜ຈ༽凸", "Lenny faces uwu");
  if (!result.thread) throw new Error("Thread is undefined.");

  expect(result.thread.author).toBe(userId);
  expect(result.thread.category).toBe(category);
  expect(result.thread.title).toBe("Lenny faces uwu");
  expect(result.thread.content.includes("凸༼ຈل͜ຈ༽凸")).toBe(true);
  expect(result.thread.content.includes("edited")).toBe(true);
  expect(result.statusCode).toBe(200);
});

test("Attempting to edit a thread that doesn't exist fails.", async () => {
  await userSetup();
  const category = await categorySetup();

  const result = await editThread(100, "凸༼ຈل͜ຈ༽凸", "Lenny faces uwu");
  expect(result.thread).toBeUndefined;
  expect(result.statusCode).toBe(404);
});

/*
  ================================
  likeThread
  ================================
  */

test("Liking thread succeeds if the thread exists and the user exists", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);

  const likeResult = await likeThread(threadId, userId);
  if (!likeResult.thread) throw new Error("Thread is undefined.");

  const user = (await getUser(userId)).user;
  if (!user) throw new Error("Unable to fetch user");

  expect(likeResult.thread.likes).toBe(1);
  expect(likeResult.statusCode).toBe(200);
  expect(user.likedThreads.includes(likeResult.thread.threadId)).toBe(true);
});

test("Liking thread fails if the thread exists and the user doesnt exists", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);

  const likeResult = await likeThread(threadId, 0);

  expect(likeResult.statusCode).toBe(404);
});

test("Liking thread fails if the thread doesnt exists and the user exists", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);

  const likeResult = await likeThread(0, userId);

  expect(likeResult.statusCode).toBe(404);
});

test("Liking an already disliked thread succeeds if the thread exists and the user exists, also make sure that the dislike is removed", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);

  await disLikeThread(threadId, userId);

  let user = (await getUser(userId)).user;
  if (!user) throw new Error("Unable to fetch user");

  expect(user.dislikedThreads.includes(threadId)).toBe(true);
  expect(user.likedThreads.includes(threadId)).toBe(false);

  await likeThread(threadId, userId);

  user = (await getUser(userId)).user;
  if (!user) throw new Error("Unable to fetch user");

  expect(user.likedThreads.includes(threadId)).toBe(true);
  expect(user.dislikedThreads.includes(threadId)).toBe(false);
});

test("Liking an already liked thread removes the previous like", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);

  await likeThread(threadId, userId);

  let user = (await getUser(userId)).user;
  if (!user) throw new Error("Unable to fetch user");

  expect(user.likedThreads.includes(threadId)).toBe(true);

  await likeThread(threadId, userId);

  user = (await getUser(userId)).user;
  if (!user) throw new Error("Unable to fetch user");

  expect(user.likedThreads.includes(threadId)).toBe(false);
});

/*
  ================================
  dislikeThread
  ================================
  */

test("Disliking a thread adds that thread to the users list of disliked threads.", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);

  await disLikeThread(threadId, userId);

  const user = (await getUser(userId)).user;
  if (!user) throw new Error("Unable to fetch user");

  const thread = (await getThread(threadId)).thread;
  if (!thread) throw new Error("Unable to fetch Thread");

  expect(thread.dislikes).toBe(1);
  expect(user.dislikedThreads.includes(thread.threadId)).toBe(true);
});

test("disLiking thread fails if the thread exists and the user doesnt exists", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);

  const likeResult = await disLikeThread(threadId, 0);

  expect(likeResult.statusCode).toBe(404);
});

test("disLiking thread fails if the thread doesnt exists and the user exists", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);

  const likeResult = await disLikeThread(0, userId);

  expect(likeResult.statusCode).toBe(404);
});

test("Disliking an already liked thread succeeds if the thread exists and the user exists, also make sure that the like is removed", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);

  await likeThread(threadId, userId);

  let user = (await getUser(userId)).user;
  if (!user) throw new Error("Unable to fetch user");

  expect(user.dislikedThreads.includes(threadId)).toBe(false);
  expect(user.likedThreads.includes(threadId)).toBe(true);

  await disLikeThread(threadId, userId);

  user = (await getUser(userId)).user;
  if (!user) throw new Error("Unable to fetch user");

  expect(user.likedThreads.includes(threadId)).toBe(false);
  expect(user.dislikedThreads.includes(threadId)).toBe(true);
});

test("Disliking an already disliked thread removes the previous dislike", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);

  await disLikeThread(threadId, userId);

  let user = (await getUser(userId)).user;
  if (!user) throw new Error("Unable to fetch user");

  expect(user.dislikedThreads.includes(threadId)).toBe(true);

  await disLikeThread(threadId, userId);

  user = (await getUser(userId)).user;
  if (!user) throw new Error("Unable to fetch user");

  expect(user.dislikedThreads.includes(threadId)).toBe(false);
});

/*
  ================================
  commentThread
  ================================
  */

test("Commenting on a thread with a vaild user succeds", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);

  const commentResult = await commentThread(
    userId,
    threadId,
    "Markus was here hehe"
  );
  if (!commentResult.thread) throw new Error("Thread is undefined.");

  const comment = (await getComment(commentResult.thread.replies[0])).comment;
  if (!comment) throw new Error("Unable to fetch comment");

  expect(commentResult.thread.replies.length).toBe(1);
  expect(comment.content).toBe("Markus was here hehe");
  expect(comment.author).toBe(userId);
  expect(commentResult.statusCode).toBe(201);
});

test("Commenting on a thread that doesnt exist with a vaild user succeds", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);

  const commentResult = await commentThread(userId, 0, "Markus was here hehe");

  expect(commentResult.statusCode).toBe(404);
});

test("Getting comments from an exsisting thread", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);
  const commentResult = await commentThread(
    userId,
    threadId,
    "Markus was here hehe"
  );
  if (!commentResult.thread) throw new Error("Thread is undefined.");

  const result = await getThreadComments(threadId);
  if (!result.comments) throw new Error("Unable to fetch comments");

  expect(result.comments.length).toBe(1);
  expect(result.statusCode).toBe(200);
});

test("Getting comments from an non-exsisting thread", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);
  const commentResult = await commentThread(
    userId,
    threadId,
    "Markus was here hehe"
  );
  if (!commentResult.thread) throw new Error("Thread is undefined.");

  const result = await getThreadComments(0);

  expect(result.statusCode).toBe(404);
});

test("getting comments from a comment", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);

  const commentResult = await commentThread(
    userId,
    threadId,
    "Markus was here hehe"
  );
  if (!commentResult.thread) throw new Error("Thread is undefined.");

  const comment2Result = await postReply(
    commentResult.thread.replies[0],
    "Markus was here hehe",
    userId
  );

  const result = await getCommentComments(commentResult.thread.replies[0]);
  if (!result.comments) throw new Error("Unable to fetch comments");

  expect(result.comments.length).toBe(1);
  expect(result.statusCode).toBe(200);
});

test("Fails to get comments from a comment that doesnt exist", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);

  const commentResult = await commentThread(
    userId,
    threadId,
    "Markus was here hehe"
  );
  if (!commentResult.thread) throw new Error("Thread is undefined.");

  const comment2Result = await postReply(
    commentResult.thread.replies[0],
    "Markus was here hehe",
    userId
  );

  const result = await getCommentComments(0);

  expect(result.statusCode).toBe(404);
});

/*
  ================================
  deleteThread
  ================================
  */

test("After deleting a thread, that thread is no longer stored.", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);
  const result = await deleteThread(threadId, userId);
  const getResult = await getThread(threadId);

  expect(getResult.thread).toBeUndefined();
  expect(result.statusCode).toBe(200);
});

test("Deleting a thread that doesnt exists as a user that exist", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);
  const result = await deleteThread(0, userId);
  const getResult = await getThread(threadId);

  expect(getResult.thread).toBeDefined();
  expect(result.statusCode).toBe(404);
});

test("Deleting a thread that exists as a user that doesnt exist", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);
  const result = await deleteThread(threadId, 0);
  const getResult = await getThread(threadId);

  expect(getResult.thread).toBeDefined();
  expect(result.statusCode).toBe(404);
});

test("Deleting a thread as a user but not the author", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);
  const registerResult = await register(
    dummyEmail,
    "2",
    dummyPassword,
    dummyDateOfBirth
  );

  if (!registerResult.user) throw new Error("Registration failed.");

  const result = await deleteThread(threadId, registerResult.user.userId);
  const getResult = await getThread(threadId);

  expect(getResult.thread).toBeDefined();
  expect(result.statusCode).toBe(403);
});

/*
  ================================
  getCategory
  ================================
  */

test("Get categories", async () => {
  const category = await categorySetup();
  const result = await getCategories();
  if (!result.categories) throw new Error("Failed to fetch categories");
  expect(result.categories.length).toBe(1);
  expect(result.statusCode).toBe(200);
});

test("Get category details if category exists", async () => {
  const category = await categorySetup();
  const result = await getCategoryDetails(category);
  if (!result.category) throw new Error("Failed to fetch details");

  expect(result.category.title).toBe(category);
  expect(result.category.description).toBe("this is a test");
  expect(result.statusCode).toBe(200);
});

test("Cannot get category details if category doesnt exists", async () => {
  const category = await categorySetup();
  const result = await getCategoryDetails("haha");

  expect(result.statusCode).toBe(404);
});

/*
  ================================
  search
  ================================
  */
test("Searching for threads", async () => {
  const userId = await userSetup();
  const category = await categorySetup();
  const threadId = await threadSetup(userId);
  const result = await searchThreads("will");
  if (!result.threads) throw new Error("Seatch Failed");

  expect(result.threads[0].threadId).toBe(threadId);
  expect(result.statusCode).toBe(200);

  const result2 = await searchThreads(":");
  if (!result2.threads) throw new Error("Seatch Failed");

  expect(result2.threads[0].threadId).toBe(threadId);
  expect(result2.statusCode).toBe(200);

  const result3 = await searchThreads("nothinghere");
  if (!result3.threads) throw new Error("Seatch Failed");

  expect(result3.threads.length).toBe(0);
  expect(result3.statusCode).toBe(200);
});
