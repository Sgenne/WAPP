import {
  likeComment,
  disLikeComment,
  editComment,
  deleteComment,
  postReply,
  comments,
  getComment,
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

// Clear all arrays before each test.
beforeEach(async () => {
  Object.keys(threads).forEach((threadId) => delete threads[threadId]);
  Object.keys(users).forEach((username) => delete users[username]);
  Object.keys(comments).forEach((comment) => delete comments[comment]);
  categories.forEach((category, index) => delete categories[index]);

  users[0] = {
    userId: -1,
    username: "Deleted",
    email: "",
    joinDate: new Date(),
    birthDate: new Date(),
    passwordHash: "",
    bio: "",
    image: "",
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
      dislikedThreads: false,
    },
  };

  categories.push(dummyCategory);
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
  let userId: number = await userSetup();
  let threadId: number = await threadSetup(userId);
  let commentId: number = await commentSetup(userId, threadId);

  const newComment = "I fully agree";
  const result = await postReply(commentId, newComment, userId);
  if (!result.comment) throw new Error("Comment is undefined.");

  const user = users[userId];
  const rootComment = comments[commentId];
  expect(result.comment.content).toBe(newComment);
  expect(result.comment.authour).toBe(user.userId);
  expect(result.comment.likes).toBe(0);
  expect(result.comment.dislikes).toBe(0);
  expect(rootComment.replies.includes(result.comment.commentId)).toBe(true);
  expect(result.statusCode).toBe(201);
});

/*
  ================================
  getComment
  ================================
  */
  test("Get comment succeds if given id exists.", async () => {
    categories.push(dummyCategory);
    const userId = await userSetup();
  
    const threadId = await threadSetup(userId);

    const commentId = await commentSetup(userId, threadId);

    const result = await getComment(commentId);
  
    expect(result.statusCode).toBe(200);
  });

  test("Create comment fails if given id does not exists.", async () => {
    const result = await getComment(0);


    expect(result.comment).toBeUndefined;
    expect(result.statusCode).toBe(404);
  });

/*
  ================================
  editComment
  ================================
  */

test("Editing a comment as a valid user", async () => {
  let userId: number = await userSetup();
  let threadId: number = await threadSetup(userId);
  let commentId: number = await commentSetup(userId, threadId);

  const newText: string = "Amazing*";
  const result = await editComment(commentId, newText, userId);
  if (!result.comment) throw new Error("Comment is undefined.");

  expect(result.comment.content.includes(newText)).toBe(true);
  expect(result.comment.content.includes("edited")).toBe(true);
  expect(result.statusCode).toBe(200);
});

/*
  ================================
  likeComment
  ================================
  */

test("Liking comment succeeds if the comment exists and the user exists, and the comment is not deleted", async () => {
  let userId: number = await userSetup();
  let threadId: number = await threadSetup(userId);
  let commentId: number = await commentSetup(userId, threadId);

  const result = await likeComment(commentId, userId);
  if (!result.comment) throw new Error("Comment is undefined.");

  const user = users[userId];
  const rootComment = comments[commentId];

  expect(user.likedComments.includes(rootComment.commentId)).toBe(true);
  expect(result.statusCode).toBe(200);
});

test("Liking comment fails if the comment exists and the user exists, and the comment is deleted", async () => {
  let userId: number = await userSetup();
  let threadId: number = await threadSetup(userId);
  let commentId: number = await commentSetup(userId, threadId);
  const user = users[userId];
  const rootComment = comments[commentId];
  deleteComment(commentId, userId);
  await likeComment(commentId, userId);

  expect(user.likedComments.includes(rootComment.commentId)).toBe(false);
});

test("Liking an already disliked thread succeeds if the thread exists and the user exists, also make sure that the dislike is removed", async () => {
  let userId: number = await userSetup();
  let threadId: number = await threadSetup(userId);
  let commentId: number = await commentSetup(userId, threadId);
  const user = users[userId];
  const rootComment = comments[commentId];

  await disLikeComment(commentId, userId);

  expect(user.dislikedComments.includes(rootComment.commentId)).toBe(true);
  expect(user.likedComments.includes(rootComment.commentId)).toBe(false);

  await likeComment(commentId, userId);

  expect(user.dislikedComments.includes(rootComment.commentId)).toBe(false);
  expect(user.likedComments.includes(rootComment.commentId)).toBe(true);
});

test("Liking an already liked comment removes the previous like as an valid user", async () => {
  let userId: number = await userSetup();
  let threadId: number = await threadSetup(userId);
  let commentId: number = await commentSetup(userId, threadId);

  await likeComment(commentId, userId);
  const result = await likeComment(commentId, userId);
  if (!result.comment) throw new Error("Comment is undefined.");

  const user = users[userId];
  const rootComment = comments[commentId];

  expect(user.likedComments.includes(rootComment.commentId)).toBe(false);
  expect(result.statusCode).toBe(200);
});

/*
  ================================
  dislikeComment
  ================================
  */

test("Disliking comment succeeds if the comment exists and the user exists, and the comment is not deleted", async () => {
  let userId: number = await userSetup();
  let threadId: number = await threadSetup(userId);
  let commentId: number = await commentSetup(userId, threadId);

  const result = await disLikeComment(commentId, userId);
  if (!result.comment) throw new Error("Comment is undefined.");

  const user = users[userId];
  const rootComment = comments[commentId];

  expect(user.dislikedComments.includes(rootComment.commentId)).toBe(true);
  expect(result.statusCode).toBe(200);
});

test("Disliking comment fails if the comment exists and the user exists, and the comment is deleted", async () => {
  let userId: number = await userSetup();
  let threadId: number = await threadSetup(userId);
  let commentId: number = await commentSetup(userId, threadId);
  const user = users[userId];
  const rootComment = comments[commentId];

  deleteComment(commentId, userId);
  await disLikeComment(commentId, userId);

  expect(user.dislikedComments.includes(rootComment.commentId)).toBe(false);
});

test("Disliking an already liked thread succeeds if the thread exists and the user exists, also make sure that the like is removed", async () => {
  let userId: number = await userSetup();
  let threadId: number = await threadSetup(userId);
  let commentId: number = await commentSetup(userId, threadId);
  const user = users[userId];
  const rootComment = comments[commentId];

  await likeComment(commentId, userId);

  expect(user.likedComments.includes(rootComment.commentId)).toBe(true);
  expect(user.dislikedComments.includes(rootComment.commentId)).toBe(false);

  await disLikeComment(commentId, userId);

  expect(user.likedComments.includes(rootComment.commentId)).toBe(false);
  expect(user.dislikedComments.includes(rootComment.commentId)).toBe(true);
});

test("Disliking an already liked comment removes the previous like as an valid user", async () => {
  let userId: number = await userSetup();
  let threadId: number = await threadSetup(userId);
  let commentId: number = await commentSetup(userId, threadId);

  await disLikeComment(commentId, userId);
  const result = await disLikeComment(commentId, userId);
  if (!result.comment) throw new Error("Comment is undefined.");

  const user = users[userId];
  const rootComment = comments[commentId];

  expect(user.dislikedComments.includes(rootComment.commentId)).toBe(false);
  expect(result.statusCode).toBe(200);
});

/*
  ================================
  deleteComment
  ================================
  */

test("deleting a comment as a valid user", async () => {
  let userId: number = await userSetup();
  let threadId: number = await threadSetup(userId);
  let commentId: number = await commentSetup(userId, threadId);

  await disLikeComment(commentId, userId);
  const result = await deleteComment(commentId, userId);
  if (!result.comment) throw new Error("Comment is undefined.");

  expect(result.comment.content).toBe("");
  //expect(result.comment.authour.username).toBe("Deleted");
  expect(result.comment.likes).toBe(0);
  expect(result.comment.dislikes).toBe(0);
  expect(result.statusCode).toBe(200);
});
