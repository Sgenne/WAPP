import { Comment } from "../model/comment.interface";
import { Thread } from "../model/thread.interface";
import { User } from "../model/user.interface";
import { users } from "./user.service";
import { comments } from "./comment.service";

/**
 * Temporary in-memory store of all threads.
 */
export const threads: { [key: string]: Thread } = {};
/**
 * Temporary in-memory store of all categories.
 */
export const categories: string[] = [
  "dogs",
  "cats",
  "Guianan Cock-of-the-rock",
];
/**
 * Global variable to know what id to assign next thread
 */
let id: number = 0;
/**
 * Global variable to know what id to assign next comment
 */
let commentID: number = 0;

export function newComment(): number {
  return commentID++;
}

/**
 * The result of a thread service.
 */
interface ThreadServiceResult {
  /**
   * An HTTP status code describing the result of the attempted operation.
   */
  statusCode: number;

  /**
   * A message describing the result of the attempted operation.
   */
  message: string;

  /**
   * The thread that was acted upon.
   */
  thread?: Thread;
}

/**
 * User likes a thread
 *
 * @param threadId - id of the thread the user likes.
 *
 * @param username - the user who likes the thread.
 *
 * @returns - A ThreadServiceResult object.
 */
export const likeThread = async (
  threadId: number,
  userId: number
): Promise<ThreadServiceResult> => {
  let thread = threads[threadId];
  let user = users[userId];
  if (user.dislikedThreads.includes(thread)) {
    let temp: number = user.dislikedThreads.lastIndexOf(thread);
    user.dislikedThreads.splice(temp, 1);
    thread.dislikes--;
  }
  if (!user.likedThreads.includes(thread)) {
    user.likedThreads.push(thread);
    thread.likes++;
  } else {
    let temp: number = user.likedThreads.lastIndexOf(thread);
    user.likedThreads.splice(temp, 1);
    thread.likes--;
  }
  return {
    statusCode: 200,
    message: "Thread like status changed successfully",
    thread: thread,
  };
};

/**
 * User dislikes a thread
 *
 * @param threadId - id of the thread the user dislikes.
 *
 * @param username - the user who dislikes the thread.
 *
 * @returns - A ThreadServiceResult object.
 */
export const disLikeThread = async (
  threadId: number,
  userId: number
): Promise<ThreadServiceResult> => {
  let thread = threads[threadId];
  let user = users[userId];
  if (user.likedThreads.includes(thread)) {
    user.likedThreads.forEach((item, index) => {
      if (item === thread) user.likedThreads.splice(index, 1);
    });
    thread.likes--;
  }
  if (!user.dislikedThreads.includes(thread)) {
    user.dislikedThreads.push(thread);
    thread.dislikes++;
  } else {
    user.dislikedThreads.forEach((item, index) => {
      if (item === thread) user.dislikedThreads.splice(index, 1);
    });
    thread.dislikes--;
  }
  return {
    statusCode: 200,
    message: "Thread dislike status changed successfully",
    thread: thread,
  };
};

/**
 * Edits the content of a thread
 *
 * @param threadId - The thread to edit
 *
 * @param content - The new content of the thread
 *
 * @param title - can change the title of the thread
 *
 * @returns A ThreadServiceResult object.
 */
export const editThread = async (
  threadId: number,
  content: string,
  title: string
): Promise<ThreadServiceResult> => {
  if (!threads[threadId]) {
    return {
      statusCode: 400,
      message: "Thread does not exist",
      thread: undefined,
    };
  }
  let thread = threads[threadId];
  var today: Date = new Date();
  var date: string =
    "\nlast edited " +
    today.getFullYear() +
    "-" +
    today.getMonth() +
    "-" +
    today.getDate();
  content += date;
  thread.content = content;
  thread.title = title;
  return {
    statusCode: 200,
    message: "Thread edited successfully",
    thread: thread,
  };
};

/**
 * Creates a new comment to a thread
 *
 * @param username - username of the user who wants to comment
 *
 * @param threadId - the thread to comment on
 *
 * @param content - the bread-text of the comment
 *
 * @returns A ThreadServiceResult object.
 */
export const commentThread = async (
  userId: number,
  threadId: number,
  content: string
): Promise<ThreadServiceResult> => {
  let thread: Thread = threads[threadId];
  let authour: User = users[userId];
  let date: Date = new Date();
  let replies: Comment[] = [];
  let likes: number = 0;
  let dislikes: number = 0;
  let commentId: number = commentID++;
  const newComment: Comment = {
    content,
    authour,
    date,
    replies,
    likes,
    dislikes,
    commentId,
  };
  thread.replies.push(newComment);
  comments[newComment.commentId] = newComment;
  return {
    statusCode: 201,
    message: "Thread posted successfully",
    thread: thread,
  };
};

/**
 * Deletes a thread
 *
 * @param threadId - The thread to delete
 *
 * @returns A ThreadServiceResult object.
 */
export const deleteThread = async (
  threadId: number,
  userId: number
): Promise<ThreadServiceResult> => {
  let thread: Thread = threads[threadId];

  if (thread.author.userId !== userId) {
    return {
      statusCode: 403,
      message: "The user does not have permission to delete this thread.",
    };
  }

  thread.replies.forEach(function (element:Comment, index:number):void {
    removeReplies(element);
    delete thread.replies[index];
  });
  delete threads[threadId];
  return {
    statusCode: 200,
    message: "Thread deleted successfully",
  };
};

function removeReplies(reply: Comment): void {
  reply.replies.forEach(function (element:Comment, index:number):void {
    removeReplies(element);
    delete reply.replies[index];
  });
}

/**
 * Creates a new thread
 *
 * @param username - username of the user who wants to create the thread
 *
 * @param category - The category the thread should be in
 *
 * @param title - the title of the thread
 *
 * @param content - the bread-text of the comment
 *
 * @returns A ThreadServiceResult object.
 */
export const postThread = async (
  userId: number,
  category: string,
  title: string,
  content: string
): Promise<ThreadServiceResult> => {
  if (categories.includes(category) && users[userId]) {
    let author: User = users[userId];
    let threadId: number = id++;
    let date: Date = new Date();
    let replies: Comment[] = [];
    let likes: number = 0;
    let dislikes: number = 0;
    const newThread: Thread = {
      likes,
      dislikes,
      title,
      content,
      author,
      date,
      category,
      replies,
      threadId,
    };

    threads[threadId] = newThread;
    return {
      statusCode: 200,
      message: "Thread posted successfully",
      thread: newThread,
    };
  }
  return {
    statusCode: 400,
    message: "Invalid inputs",
    thread: undefined,
  };
};
