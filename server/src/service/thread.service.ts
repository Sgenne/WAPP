import { Comment } from "../model/comment.interface";
import { Thread } from "../model/thread.interface";
import { Category } from "../model/category.interface";
import { threadModel } from "../db/thread.db";
import { getUser, UserServiceResult } from "./user.service";
import { userModel } from "../db/user.db";
import { commentModel } from "../db/comment.db";
import { categoryModel } from "../db/category.db";

// /**
//  * Temporary in-memory store of all categories.
//  */
// export const categories: { [key: string]: Category } = {};

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
 * The result of a thread service.
 */
interface CategoryServiceResult {
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
  categories?: Category[];
}

/**
 *
 * @param threadId The id of the thread to get
 * @returns a thread with the specified id
 */
export const getThread = async (
  threadId: number
): Promise<ThreadServiceResult> => {
  const thread: Thread | null = await threadModel.findOne({
    threadId: threadId,
  });
  if (!thread) {
    return {
      statusCode: 404,
      message: "Thread could not be found",
    };
  }
  return {
    statusCode: 200,
    message: "Thread has successfully been recived.",
    thread: thread,
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
  const userResult: UserServiceResult = await getUser(userId);

  const user = userResult.user;

  if (!user) {
    return { statusCode: 404, message: "No user with the given id exists." };
  }

  const authoredThreads: Thread[] = await threadModel.find({ author: userId });

  return {
    statusCode: 200,
    message:
      "The threads created by the user were found and returned successfully.",
    threads: authoredThreads,
  };
};
/**
 * Get list of threads user has liked
 *
 * @param username - the user who liked the threads.
 *
 * @returns - A ThreadServiceResult object.
 */
export const getLikedThreads = async (
  userId: number
): Promise<ThreadServiceResult> => {
  const userResult: UserServiceResult = await getUser(userId);
  const user = userResult.user;

  if (!user) {
    return userResult;
  }

  const likedThreads: Thread[] = await threadModel.find({ author: userId });

  return {
    statusCode: 200,
    message:
      "The threads liked by the user were found and returned successfully.",
    threads: likedThreads,
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
  const threadResult: ThreadServiceResult = await getThread(threadId);
  const userResult: UserServiceResult = await getUser(userId);

  const user = userResult.user;
  const thread = threadResult.thread;

  if (!user) {
    return userResult;
  }

  if (!thread) {
    return threadResult;
  }

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

  await userModel.updateOne({ userId: userId }, user);
  await threadModel.updateOne({ threadId: threadId }, thread);

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
  const threadResult: ThreadServiceResult = await getThread(threadId);
  const userResult: UserServiceResult = await getUser(userId);

  const thread = threadResult.thread;
  const user = userResult.user;

  if (!thread) {
    return threadResult;
  }

  if (!user) {
    return userResult;
  }

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

  await userModel.updateOne({ userId: userId }, user);
  await threadModel.updateOne({ threadId: threadId }, thread);

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
  const threadResult: ThreadServiceResult = await getThread(threadId);
  const thread = threadResult.thread;

  if (!thread) {
    return threadResult;
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

  await threadModel.updateOne({ threadId: threadId }, thread);

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
  const threadResult: ThreadServiceResult = await getThread(threadId);
  const thread: Thread | undefined = threadResult.thread;

  if (!thread) {
    return threadResult;
  }

  const author: number = userId;
  const date: Date = new Date();
  const replies: number[] = [];
  const likes: number = 0;
  const dislikes: number = 0;
  const commentId: number = new Date().getTime();
  const newComment: Comment = {
    content,
    author,
    date,
    replies,
    likes,
    dislikes,
    commentId,
    isDeleted: false,
    thread: threadId,
  };

  thread.replies.push(commentId);

  commentModel.create(newComment);
  threadModel.updateOne({ threadId: threadId }, thread);

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
  const threadResult: ThreadServiceResult = await getThread(threadId);
  const userResult: UserServiceResult = await getUser(userId);

  const user = userResult.user;
  const thread = threadResult.thread;

  if (!user) {
    return userResult;
  }

  if (!thread) {
    return threadResult;
  }

  if (userId !== thread.author) {
    return {
      statusCode: 403,
      message: "The user does not have permission to delete this thread.",
    };
  }

  commentModel.deleteMany({ thread: threadId });

  return {
    statusCode: 200,
    message: "Thread deleted successfully.",
  };
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
  category: number,
  title: string,
  content: string
): Promise<ThreadServiceResult> => {
  const userResult: UserServiceResult = await getUser(userId);
  const user = userResult.user;

  if (!user) {
    return userResult;
  }

  const existingCategory: Category | null = await categoryModel.findOne({
    CategoryId: category,
  });

  if (!existingCategory) {
    return { statusCode: 400, message: "The given category was invalid." };
  }

  const author: number = userId;
  const threadId: number = new Date().getTime();
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

  threadModel.create(newThread);

  return {
    statusCode: 200,
    message: "Thread posted successfully.",
    thread: newThread,
  };
};

/**
 *
 * @returns A list of all categories
 */
export const getCategories = async (): Promise<CategoryServiceResult> => {
  const categories: Category[] = await categoryModel.find();

  return {
    statusCode: 200,
    message: "The existing categories were found and returned successfully.",
    categories: categories,
  };
};

/**
 *
 * @returns A list of three threads
 */
export const getSampleThreads = async (
  categoryId: number
): Promise<ThreadServiceResult> => {
  const allCategories = await categoryModel.find();
  const category: Category | null = await categoryModel.findOne({
    categoryId: categoryId,
  });

  if (!category) {
    return {
      statusCode: 404,
      message: "No category with the given category id was found.",
    };
  }

  const sampleThreads = await threadModel
    .find({ category: categoryId })
    .limit(3);

  return {
    statusCode: 200,
    message: "Threads has successfully been recived.",
    threads: sampleThreads,
  };
};
