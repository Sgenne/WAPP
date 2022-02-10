import { Thread } from "../../model/thread.interface";
import { User } from "../../model/user.interface";
import { Comment } from "../../model/comment.interface";
import {
  likeComment,
  disLikeComment,
  editComment,
  deleteComment,
  postReply,
  comments,
} from "../comment.service";
import {
  categories,
  threads,
  commentThread,
  postThread,
} from "../thread.service";
import { register, signIn, users } from "../user.service";

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
let rootComment: Comment;

// Clear users before each test.
beforeEach(async () => {
  Object.keys(threads).forEach((threadId) => delete threads[threadId]);
  Object.keys(users).forEach((username) => delete users[username]);
  Object.keys(comments).forEach((comment) => delete comments[comment]);
  categories.forEach((category, index) => delete categories[index]);

  //setting up a user and a thread
  await register(dummyEmail, dummyUsername, dummyPassword, dummyDateOfBirth);
  await register(
    "deleteduser@gmail.com",
    "Deleted",
    dummyPassword,
    dummyDateOfBirth
  );

  categories.push(dummyCategory);
  const threadres = await postThread(
    dummyUsername,
    dummyCategory,
    dummyTitle,
    dummyContent
  );
  if (threadres) user = users[dummyUsername];
  if (!threadres.thread) throw new Error("Thread failed");
  thread = threadres.thread;
  //posting a thread comment / root comment
  const commentres = await commentThread(
    user.username,
    thread.threadId,
    dummyCommentContent
  );
  if (!commentres.thread) throw new Error("Thread comment failed");
  rootComment = commentres.thread.replies[0];
});

/*
    ================================
    Like a comment
    ================================
    */
test("Liking a comment as a valid user", async () => {
  const result = await likeComment(rootComment.commentId, user.username);
  if (!result.comment) throw new Error("Comment is undefined.");

  expect(user.likedComments.includes(rootComment)).toBe(true);
  expect(result.statusCode).toBe(200);
});

/*
    ================================
    Like a comment twice
    ================================
    */
test("Liking a comment twice as a valid user", async () => {
  await likeComment(rootComment.commentId, user.username);
  const result = await likeComment(rootComment.commentId, user.username);
  if (!result.comment) throw new Error("Comment is undefined.");

  expect(user.likedComments.includes(rootComment)).toBe(false);
  expect(result.statusCode).toBe(200);
});

/*
    ================================
    Dislike a comment 
    ================================
    */
test("Disliking a comment as a valid user", async () => {
  const result = await disLikeComment(rootComment.commentId, user.username);
  if (!result.comment) throw new Error("Comment is undefined.");

  expect(user.dislikedComments.includes(rootComment)).toBe(true);
  expect(result.statusCode).toBe(200);
});

/*
    ================================
    Dislike a comment twice
    ================================
    */
test("Disiking a comment twice as a valid user", async () => {
  await disLikeComment(rootComment.commentId, user.username);
  const result = await disLikeComment(rootComment.commentId, user.username);
  if (!result.comment) throw new Error("Comment is undefined.");

  expect(user.dislikedComments.includes(rootComment)).toBe(false);
  expect(result.statusCode).toBe(200);
});

/*
    ================================
    Editing a comment
    ================================
    */
test("Editing a comment as a valid user", async () => {
  const newText: string = "Amazing*";
  const result = await editComment(rootComment.commentId, newText);
  if (!result.comment) throw new Error("Comment is undefined.");

  expect(result.comment.content.includes(newText)).toBe(true);
  expect(result.comment.content.includes("edited")).toBe(true);
  expect(result.statusCode).toBe(200);
});

/*
    ================================
    "Soft" deleting a comment
    ================================
    */
test("deleting a comment as a valid user", async () => {
  await disLikeComment(rootComment.commentId, user.username);
  const result = await deleteComment(rootComment.commentId);
  if (!result.comment) throw new Error("Comment is undefined.");

  expect(result.comment.content).toBe("");
  expect(result.comment.authour.username).toBe("Deleted");
  expect(result.comment.likes).toBe(0);
  expect(result.comment.dislikes).toBe(0);
  expect(result.statusCode).toBe(200);
});

/*
    ================================
    Reply to a comment
    ================================
    */
test("replying to a comment as a valid user", async () => {
  const newComment = "I fully agree";
  const result = await postReply(
    rootComment.commentId,
    newComment,
    user.username
  );
  if (!result.comment) throw new Error("Comment is undefined.");

  expect(result.comment.content).toBe(newComment);
  expect(result.comment.authour.username).toBe(user.username);
  expect(result.comment.likes).toBe(0);
  expect(result.comment.dislikes).toBe(0);
  expect(rootComment.replies.includes(result.comment)).toBe(true);
  expect(result.statusCode).toBe(200);
});
