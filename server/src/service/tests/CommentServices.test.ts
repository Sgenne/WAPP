import mongoose from "mongoose";
import { categoryModel } from "../../db/category.db";
import { commentModel } from "../../db/comment.db";
import { connectToDbTest } from "../../db/connectiontest";
import { threadModel } from "../../db/thread.db";
import { userModel } from "../../db/user.db";
import { Category } from "../../model/category.interface";
import { Thread } from "../../model/thread.interface";
import { User } from "../../model/user.interface";
import {
  likeComment,
  disLikeComment,
  editComment,
  deleteComment,
  postReply,
  getComment,
  getCommentsByAuthor,
  getLikedComments,
} from "../comment.service";
//import { DEFAULT_IMAGE_ID, images } from "../image.service";
import { commentThread, postThread } from "../thread.service";
import { getUser, register } from "../user.service";

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

// Clear all arrays before each test.
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

beforeEach(async () => {
  await threadModel.deleteMany({});
  await commentModel.deleteMany({});
  await userModel.deleteMany({});
  await categoryModel.deleteMany({});
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

/*
  ================================
  postReply
  ================================
  */

test("replying to a comment as a valid user", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  const newComment = "I fully agree";

  const result = await postReply(commentId, newComment, user.userId);
  if (!result.comment) throw new Error("Comment is undefined.");

  const rootComment = (await getComment(commentId)).comment;
  if (!rootComment) throw new Error("unable to fetch comment");

  expect(result.comment.content).toBe(newComment);
  expect(result.comment.author).toBe(user.userId);
  expect(result.comment.likes).toBe(0);
  expect(result.comment.dislikes).toBe(0);
  expect(rootComment.replies.includes(result.comment.commentId)).toBe(true);
  expect(result.statusCode).toBe(201);
});

test("replying to a comment as an invalid user", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  const newComment = "I fully agree";

  const result = await postReply(commentId, newComment, 0);

  expect(result.statusCode).toBe(404);
});

test("replying to a comment that doesnt exist as a valid user", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  const newComment = "I fully agree";

  const result = await postReply(0, newComment, user.userId);

  expect(result.statusCode).toBe(404);
});

/*
  ================================
  getComment
  ================================
  */
test("Get comment succeds if given id exists.", async () => {
  const commentId = await commentSetup(user.userId, thread.threadId);
  const result = await getComment(commentId);

  expect(result.statusCode).toBe(200);
});

test("Create comment fails if given id does not exists.", async () => {
  const result = await getComment(0);

  expect(result.comment).toBeUndefined;
  expect(result.statusCode).toBe(404);
});

test("Get comments by author succeds if the author exists", async () => {
  const commentId = await commentSetup(user.userId, thread.threadId);
  const result = await getCommentsByAuthor(user.userId);
  if (!result.comments) throw new Error("Couldnt fetch comments");

  expect(result.statusCode).toBe(200);
  expect(result.comments.length).toBe(1);
});

test("Get comments by author fails if the author doesnt exists", async () => {
  const commentId = await commentSetup(user.userId, thread.threadId);
  const result = await getCommentsByAuthor(0);

  expect(result.statusCode).toBe(404);
});

test("Get liked comments by author succeds if the author exists", async () => {
  const commentId = await commentSetup(user.userId, thread.threadId);
  await likeComment(commentId, user.userId);
  const result = await getLikedComments(user.userId);
  if (!result.comments) throw new Error("Couldnt fetch comments");

  expect(result.statusCode).toBe(200);
  expect(result.comments.length).toBe(1);
});

test("Get liked comments by author fails if the author doesnt exists", async () => {
  const commentId = await commentSetup(user.userId, thread.threadId);
  await likeComment(commentId, user.userId);
  const result = await getLikedComments(0);

  expect(result.statusCode).toBe(404);
});

/*
  ================================
  editComment
  ================================
  */

test("Editing a comment as a valid user", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  const newText: string = "Amazing*";
  const result = await editComment(commentId, newText, user.userId);
  if (!result.comment) throw new Error("Comment is undefined.");

  expect(result.comment.content.includes(newText)).toBe(true);
  expect(result.comment.content.includes("edited")).toBe(true);
  expect(result.statusCode).toBe(200);
});

test("Editing a comment as a invalid user", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  const registerResult = await register(
    dummyEmail,
    "2",
    dummyPassword,
    dummyDateOfBirth
  );
  if (!registerResult.user) throw new Error("Failed to register user");

  const newText: string = "Amazing*";
  const result = await editComment(
    commentId,
    newText,
    registerResult.user?.userId
  );

  expect(result.statusCode).toBe(403);
});

test("Editing a comment that doesnt exist as a valid user", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  const newText: string = "Amazing*";
  const result = await editComment(0, newText, user.userId);
  expect(result.statusCode).toBe(404);
});

/*
  ================================
  likeComment
  ================================
  */

test("Liking comment succeeds if the comment exists and the user exists, and the comment is not deleted", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  const result = await likeComment(commentId, user.userId);
  if (!result.comment) throw new Error("Comment is undefined.");

  user = (await getUser(user.userId)).user || user;

  expect(user.likedComments.includes(commentId)).toBe(true);
  expect(result.statusCode).toBe(200);
});

test("Liking comment fails if the comment doesnt exists and the user exists, and the comment is not deleted", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  const result = await likeComment(0, user.userId);

  user = (await getUser(user.userId)).user || user;

  expect(user.likedComments.includes(commentId)).toBe(false);
  expect(result.statusCode).toBe(404);
});

test("Liking comment fails if the comment exists and the user doesnt exists, and the comment is not deleted", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  const result = await likeComment(commentId, 0);

  user = (await getUser(user.userId)).user || user;

  expect(user.likedComments.includes(commentId)).toBe(false);
  expect(result.statusCode).toBe(404);
});

test("Liking comment fails if the comment exists and the user exists, and the comment is deleted", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);
  const rootComment = (await getComment(commentId)).comment;
  if (!rootComment) throw new Error("unable to fetch comment");

  await deleteComment(commentId, user.userId);
  const result = await likeComment(commentId, user.userId);
  expect(user.likedComments.includes(rootComment.commentId)).toBe(false);
  expect(result.statusCode).toBe(405);
});

test("Liking an already disliked thread succeeds if the thread exists and the user exists, also make sure that the dislike is removed", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);
  const rootComment = (await getComment(commentId)).comment;
  if (!rootComment) throw new Error("unable to fetch comment");

  await disLikeComment(commentId, user.userId);

  user = (await getUser(user.userId)).user || user;

  expect(user.dislikedComments.includes(rootComment.commentId)).toBe(true);
  expect(user.likedComments.includes(rootComment.commentId)).toBe(false);

  await likeComment(commentId, user.userId);

  user = (await getUser(user.userId)).user || user;

  expect(user.dislikedComments.includes(rootComment.commentId)).toBe(false);
  expect(user.likedComments.includes(rootComment.commentId)).toBe(true);
});

test("Liking an already liked comment removes the previous like as an valid user", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  await likeComment(commentId, user.userId);
  const result = await likeComment(commentId, user.userId);
  if (!result.comment) throw new Error("Comment is undefined.");

  user = (await getUser(user.userId)).user || user;

  expect(user.likedComments.includes(commentId)).toBe(false);
  expect(result.statusCode).toBe(200);
});

/*
  ================================
  dislikeComment
  ================================
  */

test("Disliking comment succeeds if the comment exists and the user exists, and the comment is not deleted", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  const result = await disLikeComment(commentId, user.userId);
  if (!result.comment) throw new Error("Comment is undefined.");

  user = (await getUser(user.userId)).user || user;

  expect(user.dislikedComments.includes(commentId)).toBe(true);
  expect(result.statusCode).toBe(200);
});

test("Disliking comment fails if the comment doesnt exists and the user exists, and the comment is not deleted", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  const result = await disLikeComment(0, user.userId);

  user = (await getUser(user.userId)).user || user;

  expect(user.dislikedComments.includes(commentId)).toBe(false);
  expect(result.statusCode).toBe(404);
});

test("Disliking comment fails if the comment exists and the user doesnt exists, and the comment is not deleted", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  const result = await disLikeComment(commentId, 0);

  user = (await getUser(user.userId)).user || user;

  expect(user.dislikedComments.includes(commentId)).toBe(false);
  expect(result.statusCode).toBe(404);
});

test("Disliking comment fails if the comment exists and the user exists, and the comment is deleted", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  await deleteComment(commentId, user.userId);
  await disLikeComment(commentId, user.userId);

  user = (await getUser(user.userId)).user || user;

  expect(user.dislikedComments.includes(commentId)).toBe(false);
});

test("Disliking an already liked thread succeeds if the thread exists and the user exists, also make sure that the like is removed", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  await likeComment(commentId, user.userId);

  user = (await getUser(user.userId)).user || user;

  expect(user.likedComments.includes(commentId)).toBe(true);
  expect(user.dislikedComments.includes(commentId)).toBe(false);

  await disLikeComment(commentId, user.userId);

  user = (await getUser(user.userId)).user || user;

  expect(user.likedComments.includes(commentId)).toBe(false);
  expect(user.dislikedComments.includes(commentId)).toBe(true);
});

test("Disliking an already liked comment removes the previous like as an valid user", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  await disLikeComment(commentId, user.userId);
  const result = await disLikeComment(commentId, user.userId);
  if (!result.comment) throw new Error("Comment is undefined.");

  user = (await getUser(user.userId)).user || user;

  expect(user.dislikedComments.includes(commentId)).toBe(false);
  expect(result.statusCode).toBe(200);
});

/*
  ================================
  deleteComment
  ================================
  */

test("deleting a comment as a valid user", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  await disLikeComment(commentId, user.userId);
  const result = await deleteComment(commentId, user.userId);
  if (!result.comment) throw new Error("Comment is undefined.");

  expect(result.comment.content).toBe("");
  expect(result.comment.likes).toBe(0);
  expect(result.comment.dislikes).toBe(0);
  expect(result.statusCode).toBe(200);
});

test("deleting a comment that doesnt exist as a valid user", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  await disLikeComment(commentId, user.userId);
  const result = await deleteComment(0, user.userId);

  expect(result.statusCode).toBe(404);
});

test("deleting a comment as a valid user but not a valid author", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  const registerResult = await register(
    dummyEmail,
    "2",
    dummyPassword,
    dummyDateOfBirth
  );
  if (!registerResult.user) throw new Error("unable to register user");

  await disLikeComment(commentId, user.userId);
  const result = await deleteComment(commentId, registerResult.user.userId);

  expect(result.statusCode).toBe(403);
});

test("deleting a comment twice as a valid user", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  await disLikeComment(commentId, user.userId);
  await deleteComment(commentId, user.userId);
  const result = await deleteComment(commentId, user.userId);

  expect(result.statusCode).toBe(405);
});
