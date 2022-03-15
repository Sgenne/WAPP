import { categoryModel } from "../../db/category.db";
import { Category } from "../../model/category.interface";
import { Thread } from "../../model/thread.interface";
import { User } from "../../model/user.interface";
import { clearTestDB, closeTestDB, startTestDB } from "../../setupTests";
import {
  likeComment,
  dislikeComment,
  editComment,
  deleteComment,
  postReply,
  getComment,
  getCommentsByAuthor,
  getLikedComments,
  getCommentComments,
} from "../comment.service";
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

test("getting comments from a comment", async () => {
  const commentResult = await commentThread(
    user.userId,
    thread.threadId,
    "Markus was here hehe"
  );
  if (!commentResult.thread) throw new Error("Thread is undefined.");

  const comment2Result = await postReply(
    commentResult.thread.replies[0],
    "Markus was here hehe",
    user.userId
  );

  const result = await getCommentComments(commentResult.thread.replies[0]);
  if (!result.comments) throw new Error("Unable to fetch comments");

  expect(result.comments.length).toBe(1);
  expect(result.statusCode).toBe(200);
});

test("Fails to get comments from a comment that doesnt exist", async () => {
  const commentResult = await commentThread(
    user.userId,
    thread.threadId,
    "Markus was here hehe"
  );
  if (!commentResult.thread) throw new Error("Thread is undefined.");

  const comment2Result = await postReply(
    commentResult.thread.replies[0],
    "Markus was here hehe",
    user.userId
  );

  const result = await getCommentComments(0);

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

  await dislikeComment(commentId, user.userId);

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

  const result = await dislikeComment(commentId, user.userId);
  if (!result.comment) throw new Error("Comment is undefined.");

  user = (await getUser(user.userId)).user || user;

  expect(user.dislikedComments.includes(commentId)).toBe(true);
  expect(result.statusCode).toBe(200);
});

test("Disliking comment fails if the comment doesnt exists and the user exists, and the comment is not deleted", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  const result = await dislikeComment(0, user.userId);

  user = (await getUser(user.userId)).user || user;

  expect(user.dislikedComments.includes(commentId)).toBe(false);
  expect(result.statusCode).toBe(404);
});

test("Disliking comment fails if the comment exists and the user doesnt exists, and the comment is not deleted", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  const result = await dislikeComment(commentId, 0);

  user = (await getUser(user.userId)).user || user;

  expect(user.dislikedComments.includes(commentId)).toBe(false);
  expect(result.statusCode).toBe(404);
});

test("Disliking comment fails if the comment exists and the user exists, and the comment is deleted", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  await deleteComment(commentId, user.userId);
  await dislikeComment(commentId, user.userId);

  user = (await getUser(user.userId)).user || user;

  expect(user.dislikedComments.includes(commentId)).toBe(false);
});

test("Disliking an already liked thread succeeds if the thread exists and the user exists, also make sure that the like is removed", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  await likeComment(commentId, user.userId);

  user = (await getUser(user.userId)).user || user;

  expect(user.likedComments.includes(commentId)).toBe(true);
  expect(user.dislikedComments.includes(commentId)).toBe(false);

  await dislikeComment(commentId, user.userId);

  user = (await getUser(user.userId)).user || user;

  expect(user.likedComments.includes(commentId)).toBe(false);
  expect(user.dislikedComments.includes(commentId)).toBe(true);
});

test("Disliking an already liked comment removes the previous like as an valid user", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  await dislikeComment(commentId, user.userId);
  const result = await dislikeComment(commentId, user.userId);
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

  await dislikeComment(commentId, user.userId);
  const result = await deleteComment(commentId, user.userId);
  if (!result.comment) throw new Error("Comment is undefined.");

  expect(result.comment.content).toBe("");
  expect(result.comment.likes).toBe(0);
  expect(result.comment.dislikes).toBe(0);
  expect(result.statusCode).toBe(200);
});

test("deleting a comment as a valid user deletes both its comment and subcomments", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);
  await postReply(commentId, "test",user.userId);
  await postReply(commentId, "test",user.userId);

  const result = await deleteComment(commentId, user.userId);
  if (!result.comment) throw new Error("Comment is undefined.");

  expect(result.statusCode).toBe(200);
});

test("deleting a comment that doesnt exist as a valid user", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  await dislikeComment(commentId, user.userId);
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

  await dislikeComment(commentId, user.userId);
  const result = await deleteComment(commentId, registerResult.user.userId);

  expect(result.statusCode).toBe(403);
});

test("deleting a comment twice as a valid user", async () => {
  let commentId: number = await commentSetup(user.userId, thread.threadId);

  await dislikeComment(commentId, user.userId);
  await deleteComment(commentId, user.userId);
  const result = await deleteComment(commentId, user.userId);

  expect(result.statusCode).toBe(405);
});
