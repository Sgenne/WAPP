import { Comment } from "../model/comment.interface";
import { Thread } from "../model/thread.interface";
import { User } from "../model/user.interface";
import { users } from "./user.service";
import { comments } from "./comment.service";

/**
 * Temporary in-memory store of all threads.
 */
export const threads: { [threadId: string]: Thread } = {
  [1]: {
    author: 1,
    content:
      "Toast is bread that has been browned by radiant heat. The browning is the result of a Maillard reaction, altering the flavor of the bread and making it firmer so that it is easier to spread toppings on it. Toasting is a common method of making stale bread more palatable. Bread is often toasted using a toaster, but toaster ovens are also used. Pre-sliced bread is most commonly used.",
    title: "About me",
    date: new Date(),
    threadId: 1,
    likes: 10,
    dislikes: 3,
    category: "bread",
    replies: [],
  },
  [2]: {
    author: 1,
    content:
      "Toast is a common breakfast food. Bagels and English muffins are also toasted.",
    title: "Breakfast",
    date: new Date(),
    threadId: 2,
    likes: 20,
    dislikes: 11,
    category: "bread",
    replies: [],
  },
  [3]: {
    author: 1,
    content:
      "A more recent cultural phenomenon is the popularity of avocado toast, which is toast spread with mashed avocado. It is associated with the Millennial generation in particular as a stereotypical food consumed by that group.",
    title: "A modern version",
    date: new Date(),
    threadId: 3,
    likes: 3,
    dislikes: 11,
    category: "bread",
    replies: [],
  },
};
/**
 * Temporary in-memory store of all categories.
 */
export const categories: string[] = [
  "dogs",
  "cats",
  "Guianan Cock-of-the-rock",
  "bread",
];
/**
 * Global variable to know what id to assign next thread.
 */
let id: number = 0;

/**
 * Global variable to know what id to assign next comment.
 */
let commentID: number = 0;

export const newComment = (): number => {
  return commentID++;
};

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
   * The thread that was acted upon if the service was successfull.
   */
  thread?: Thread;

  /**
   * The threads that were acted upon if the service was successfull.
   */
  threads?: Thread[];
}

/**
 *
 * @param threadId The id of the thread to get
 * @returns a thread with the specified id
 */
export const getThread = async (
  threadId: number
): Promise<ThreadServiceResult> => {
  const thread = threads[threadId];
  if (thread) {
    return {
      statusCode: 200,
      message: "Thread has successfully been recived.",
      thread: thread,
    };
  }
  return {
    statusCode: 404,
    message: "Thread could not be found",
    thread: undefined,
  };
};

/**
 * Returns the threads created by the user with the given id.
 *
 * @param userId - The id of the author of the threads to return.
 *
 * @returns A ThreadServiceResult object.
 */
export const getThreadsByAuthor = async (
  userId: number
): Promise<ThreadServiceResult> => {
  const user = users[userId];

  if (!user) {
    return { statusCode: 404, message: "No user with the given id exists." };
  }

  const authoredThreads = Object.values(threads).filter(
    (thread) => thread.author === userId
  );

  return {
    statusCode: 200,
    message:
      "The threads created by the user were found and returned successfully.",
    threads: authoredThreads,
  };
};
export const getLikedThreads = async (
  userId: number
): Promise<ThreadServiceResult> => {
  const user = users[userId];
  if (!user) {
    return { statusCode: 404, message: "No user with the given id exists." };
  }
  const result: Thread[] = [];
  Object.keys(threads).forEach((threadId) => {
    if (user.likedThreads.includes(+threadId)) {
      result.push(threads[threadId]);
    }
  });
  return {
    statusCode: 200,
    message:
      "The threads liked by the user were found and returned successfully.",
    threads: result,
  };
};

/**
 * User likes a thread.
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
  const thread = threads[threadId];
  const user = users[userId];

  if (user.dislikedThreads.includes(threadId)) {
    user.dislikedThreads = user.dislikedThreads.filter(
      (elem) => elem !== threadId
    );
    thread.dislikes--;
  }

  if (!user.likedThreads.includes(threadId)) {
    user.likedThreads.push(threadId);
    thread.likes++;
  } else {
    user.likedThreads = user.likedThreads.filter((elem) => elem !== threadId);
    thread.likes--;
  }
  return {
    statusCode: 200,
    message: "Thread like status changed successfully.",
    thread: thread,
  };
};

/**
 * User dislikes a thread.
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
  const thread = threads[threadId];
  const user = users[userId];

  if (user.likedThreads.includes(threadId)) {
    user.likedThreads = user.likedThreads.filter((elem) => elem !== threadId);
    thread.likes--;
  }

  if (!user.dislikedThreads.includes(threadId)) {
    user.dislikedThreads.push(threadId);
    thread.dislikes++;
  } else {
    user.dislikedThreads = user.dislikedThreads.filter(
      (elem) => elem !== threadId
    );
    thread.dislikes--;
  }

  return {
    statusCode: 200,
    message: "Thread dislike status changed successfully",
    thread: thread,
  };
};

/**
 * Edits the content of a thread.
 *
 * @param threadId - The id of the thread to edit.
 *
 * @param content - The new content of the thread.
 *
 * @param title - The new title of the thread.
 *
 * @returns A ThreadServiceResult object.
 */
export const editThread = async (
  threadId: number,
  content: string,
  title: string
): Promise<ThreadServiceResult> => {
  const thread: Thread = threads[threadId];

  if (!thread) {
    return {
      statusCode: 404,
      message: "Thread does not exist.",
    };
  }

  const today: Date = new Date();
  const date: string =
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
    message: "Thread edited successfully.",
    thread: thread,
  };
};

/**
 * Creates a new comment to a thread.
 *
 * @param userId - The id of the user who wants to comment.
 *
 * @param threadId - The id of the thread to comment on.
 *
 * @param content - The content of the comment.
 *
 * @returns A ThreadServiceResult object.
 */
export const commentThread = async (
  userId: number,
  threadId: number,
  content: string
): Promise<ThreadServiceResult> => {
  const thread: Thread = threads[threadId];
  const authour: number = userId;
  const date: Date = new Date();
  const replies: number[] = [];
  const likes: number = 0;
  const dislikes: number = 0;
  const commentId: number = commentID++;
  const newComment: Comment = {
    content,
    authour,
    date,
    replies,
    likes,
    dislikes,
    commentId,
  };

  thread.replies.push(commentId);
  comments[newComment.commentId] = newComment;
  return {
    statusCode: 201,
    message: "Thread posted successfully.",
    thread: thread,
  };
};

/**
 * Deletes a thread.
 *
 * @param threadId - The thread to delete.
 *
 * @returns A ThreadServiceResult object.
 */
export const deleteThread = async (
  threadId: number,
  userId: number
): Promise<ThreadServiceResult> => {
  const thread: Thread = threads[threadId];

  if (userId !== userId) {
    return {
      statusCode: 403,
      message: "The user does not have permission to delete this thread.",
    };
  }

  thread.replies.forEach((element: number, index: number): void => {
    removeReplies(comments[element]);
    delete thread.replies[index];
  });
  delete threads[threadId];

  return {
    statusCode: 200,
    message: "Thread deleted successfully.",
  };
};

const removeReplies = (reply: Comment): void => {
  reply.replies.forEach((element: number, index: number): void => {
    removeReplies(comments[element]);
    delete reply.replies[index];
  });
};

/**
 * Creates a new thread.
 *
 * @param userId - id of the user who wants to create the thread.
 *
 * @param category - The category the thread should be in.
 *
 * @param title - The title of the thread.
 *
 * @param content - The text of the comment.
 *
 * @returns A ThreadServiceResult object.
 */
export const postThread = async (
  userId: number,
  category: string,
  title: string,
  content: string
): Promise<ThreadServiceResult> => {
  if (!categories.includes(category)) {
    return { statusCode: 400, message: "The given category was invalid." };
  }

  const author: number = userId;
  const threadId: number = id++;
  const date: Date = new Date();
  const replies: number[] = [];
  const likes: number = 0;
  const dislikes: number = 0;

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
    message: "Thread posted successfully.",
    thread: newThread,
  };
};
