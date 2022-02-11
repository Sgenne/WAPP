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
import { register, users } from "../user.service";

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

  users[0] = {
    userId: -1,
    username: "Deleted",
    email: "",
    joinDate: new Date(),
    birthDate: new Date(),
    passwordHash: "",
    likedThreads: [],
    dislikedThreads: [],
    likedComments: [],
    dislikedComments: [],
    visibleProperties: {
      email: false,
      joinDate: false,
      birthDate: false,
      bio: false,
      image: false,
      likedThreads: false,
      unlikedThreads: false,
    },
  };

  categories.forEach((category, index) => delete categories[index]);

  //setting up a user and a thread
  const registerResult = await register(
    dummyEmail,
    dummyUsername,
    dummyPassword,
    dummyDateOfBirth
  );

  if (!registerResult.user) throw new Error("Registration failed.");

  user = registerResult.user;

  categories.push(dummyCategory);
  const threadres = await postThread(
    user.userId,
    dummyCategory,
    dummyTitle,
    dummyContent
  );
  if (!threadres.thread) throw new Error("Thread failed");
  thread = threadres.thread;
  //posting a thread comment / root comment
  const commentres = await commentThread(
    user.userId,
    thread.threadId,
    dummyCommentContent
  );
  if (!commentres.thread) throw new Error("Thread comment failed");
  rootComment = commentres.thread.replies[0];
});

test("Liking a comment as a valid user", async () => {
  const result = await likeComment(rootComment.commentId, user.userId);
  if (!result.comment) throw new Error("Comment is undefined.");

  expect(user.likedComments.includes(rootComment)).toBe(true);
  expect(result.statusCode).toBe(200);
});

test("Liking a comment twice as a valid user", async () => {
  await likeComment(rootComment.commentId, user.userId);
  const result = await likeComment(rootComment.commentId, user.userId);
  if (!result.comment) throw new Error("Comment is undefined.");

  expect(user.likedComments.includes(rootComment)).toBe(false);
  expect(result.statusCode).toBe(200);
});

test("Disliking a comment as a valid user", async () => {
  const result = await disLikeComment(rootComment.commentId, user.userId);
  if (!result.comment) throw new Error("Comment is undefined.");

  expect(user.dislikedComments.includes(rootComment)).toBe(true);
  expect(result.statusCode).toBe(200);
});

test("Disiking a comment twice as a valid user", async () => {
  await disLikeComment(rootComment.commentId, user.userId);
  const result = await disLikeComment(rootComment.commentId, user.userId);
  if (!result.comment) throw new Error("Comment is undefined.");

  expect(user.dislikedComments.includes(rootComment)).toBe(false);
  expect(result.statusCode).toBe(200);
});

test("Editing a comment as a valid user", async () => {
  const newText: string = "Amazing*";
  const result = await editComment(rootComment.commentId, newText, user.userId);
  if (!result.comment) throw new Error("Comment is undefined.");

  expect(result.comment.content.includes(newText)).toBe(true);
  expect(result.comment.content.includes("edited")).toBe(true);
  expect(result.statusCode).toBe(200);
});

test("deleting a comment as a valid user", async () => {
  await disLikeComment(rootComment.commentId, user.userId);
  const result = await deleteComment(rootComment.commentId, user.userId);
  if (!result.comment) throw new Error("Comment is undefined.");

  expect(result.comment.content).toBe("");
  expect(result.comment.authour.username).toBe("Deleted");
  expect(result.comment.likes).toBe(0);
  expect(result.comment.dislikes).toBe(0);
  expect(result.statusCode).toBe(200);
});

test("replying to a comment as a valid user", async () => {
  const newComment = "I fully agree";
  const result = await postReply(
    rootComment.commentId,
    newComment,
    user.userId
  );
  if (!result.comment) throw new Error("Comment is undefined.");

  expect(result.comment.content).toBe(newComment);
  expect(result.comment.authour.username).toBe(user.username);
  expect(result.comment.likes).toBe(0);
  expect(result.comment.dislikes).toBe(0);
  expect(rootComment.replies.includes(result.comment)).toBe(true);
  expect(result.statusCode).toBe(200);
});
