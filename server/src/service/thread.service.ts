import { Comment } from "../model/comment.interface";
import { Thread } from "../model/thread.interface";
import { Category } from "../model/category.interface";
import { threadModel } from "../db/thread.db";
import { getUser, UserServiceResult } from "./user.service";
import { userModel } from "../db/user.db";
import { commentModel } from "../db/comment.db";
import { categoryModel } from "../db/category.db";

/**
 * The result of a thread service. Contains a status code and message describing the
 * result of the attempted service. If the service was successful, then the result
 * will contain the relevant thread or threads.
 */
interface ThreadServiceResult {
  statusCode: number;
  message: string;
  thread?: Thread;
  threads?: Thread[];
  comments?: Comment[];
}

/**
 * The result of a category service. Contains a status code and message describing the
 * result of the attempted service. If the service was successful, then the result
 * will contain the relevant categories.
 */
interface CategoryServiceResult {
  statusCode: number;
  message: string;
  category?: Category;
  categories?: Category[];
}

/**
 * Returns the thread with the given id.
 *
 * @param threadId The id of the thread to get.
 */
export const getThread = async (
  threadId: number
): Promise<ThreadServiceResult> => {
  const thread: Thread | null = await threadModel.findOne({
    threadId: threadId,
  });
  console.log(thread);
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

  const likedThreads: Thread[] = await threadModel.find({
    threadId: { $in: user.likedThreads },
  });

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
 * @param userId - the user who likes the thread.
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
 * @param userId - the user who dislikes the thread.
 */
export const disLikeThread = async (
  threadId: number,
  userId: number
): Promise<ThreadServiceResult> => {
  const threadResult: ThreadServiceResult = await getThread(threadId);
  const userResult: UserServiceResult = await getUser(userId);

  const thread = threadResult.thread;
  const user = userResult.user;

  if (!user) {
    return userResult;
  }
  if (!thread) {
    return threadResult;
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
    rootThread: threadId,
  };

  thread.replies.push(commentId);
  await commentModel.create(newComment);
  await threadModel.updateOne(
    { threadId: threadId },
    { replies: thread.replies }
  );

  return {
    statusCode: 201,
    message: "Comment posted successfully.",
    thread: thread,
  };
};

/**
 * Deletes a thread.
 *
 * @param threadId - The thread to delete.
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

  await threadModel.deleteOne({ threadId: threadId });
  await commentModel.deleteMany({ root: threadId });

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
 */
export const postThread = async (
  userId: number,
  category: string,
  title: string,
  content: string
): Promise<ThreadServiceResult> => {
  const userResult: UserServiceResult = await getUser(userId);
  const user = userResult.user;

  if (!user) {
    return userResult;
  }

  const existingCategory: Category | null = await categoryModel.findOne({
    CategoryTitle: category,
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

  await threadModel.create(newThread);

  return {
    statusCode: 201,
    message: "Thread posted successfully.",
    thread: newThread,
  };
};

/**
 * Returns a list of all categories.
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
 * Returns a list of all categories.
 */
export const getCategoryDetails = async (
  categoryTitle: string
): Promise<CategoryServiceResult> => {
  const category: Category | null = await categoryModel.findOne({
    title: categoryTitle,
  });

  if (!category) {
    return {
      statusCode: 404,
      message: "No category with the given category title was found.",
    };
  }

  return {
    statusCode: 200,
    message: "The category's details were found and returned successfully.",
    category: category,
  };
};

/**
 * Returns three sample threads from a specified category.
 */
export const getSampleThreads = async (
  categoryTitle: string
): Promise<ThreadServiceResult> => {
  const allCategories = await categoryModel.find();
  const category: Category | null = await categoryModel.findOne({
    categoryTitle: categoryTitle,
  });

  if (!category) {
    return {
      statusCode: 404,
      message: "No category with the given category id was found.",
    };
  }

  const sampleThreads = await threadModel
    .find({ category: categoryTitle })
    .limit(3);

  return {
    statusCode: 200,
    message: "Threads has successfully been recived.",
    threads: sampleThreads,
  };
};

/**
 * Returns all threads from a specified category.
 *
 * @param categoryTitle - The title of the category whose threads should be returned.
 */
export const getCategoryThreads = async (
  categoryTitle: string
): Promise<ThreadServiceResult> => {
  const threadArr: Thread[] = await threadModel
    .find({
      category: categoryTitle,
    })
    .sort({ _id: -1 });

  return {
    statusCode: 200,
    message: "Threads has successfully been recived.",
    threads: threadArr,
  };
};

/**
 * Returns all comments from a specified thread.
 *
 * @param threadId - The id of the thread whose comments should be returned.
 */
export const getThreadComments = async (
  threadId: number
): Promise<ThreadServiceResult> => {
  const thread: Thread | null = await threadModel.findOne({
    threadId: threadId,
  });

  if (!thread) {
    return {
      statusCode: 404,
      message: "There are no comments",
      thread: undefined,
    };
  }

  const commentArr = await commentModel.find({
    commentId: { $in: thread.replies },
  });

  return {
    statusCode: 200,
    message: "Comments has successfully been recived.",
    comments: commentArr,
  };
};

/**
 * Returns all replies to a specific root comment.
 *
 * @param rootId - The id of the root comment.
 */
export const getCommentComments = async (
  rootId: number
): Promise<ThreadServiceResult> => {
  const comment: Comment | null = await commentModel.findOne({
    commentId: rootId,
  });

  if (!comment) {
    return {
      statusCode: 404,
      message: "No comment with the given root comment id exists.",
    };
  }

  const commentArr: Comment[] = await commentModel.find({
    commentId: { $in: comment.replies },
  });

  return {
    statusCode: 200,
    message: "Comments has successfully been recived.",
    comments: commentArr,
  };
};

export const searchThreads = async (
  query: string
): Promise<ThreadServiceResult> => {
  const searchResult: Thread[] = await threadModel.find({
    $or: [
      {
        content: { $regex: new RegExp(query, "i") },
      },
      {
        title: { $regex: new RegExp(query, "i") },
      },
    ],
  });

  return {
    statusCode: 200,
    message: "Threads found successfully.",
    threads: searchResult,
  };
};
