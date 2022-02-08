import { Comment } from "../model/comment.interface";
import { Thread } from "../model/thread.interface";
import { User } from "../model/user.interface";

const users: { [key: string]: User } = {};
const threads: { [key: string]: Thread } = {};
const categories: string[] = [];
let id: number = 0;
export let commentID: number = 0;

export const likeThread = async (threadId: number, username: string) => {
  let thread = threads[threadId];
  let user = users[username];
  if (!user.likedThreads.includes(thread)) {
    user.likedThreads.push(thread);
    thread.likes++;
  } else {
    let temp: number = user.likedThreads.lastIndexOf(thread);
    user.likedThreads = user.likedThreads.splice(temp, 1);
    thread.likes--;
  }
  return {
    statusCode: 200,
    message: "Thread like status changed successfully",
    thread: thread,
  };
};

export const disLikeThread = async (threadId: number, username: string) => {
  let thread = threads[threadId];
  let user = users[username];
  if (!user.dislikedThreads.includes(thread)) {
    user.dislikedThreads.push(thread);
    thread.dislikes++;
  } else {
    let temp: number = user.dislikedThreads.lastIndexOf(thread);
    user.dislikedThreads = user.dislikedThreads.splice(temp, 1);
    thread.dislikes--;
  }
  return {
    statusCode: 200,
    message: "Thread dislike status changed successfully",
    thread: thread,
  };
};

export const editThread = async (
  threadId: number,
  breadText: string,
  title: string
) => {
  let thread = threads[threadId];
  var today: Date = new Date();
  var date: string =
    "\nlast edited" +
    today.getFullYear() +
    "-" +
    today.getMonth() +
    "-" +
    today.getDate();
  breadText += date;
  thread.breadText = breadText;
  thread.title = title;
  return {
    statusCode: 200,
    message: "Thread edited successfully",
    thread: thread,
  };
};

export const commentThread = async (
  username: string,
  threadId: number,
  breadText: string
) => {
  let thread: Thread = threads[threadId];
  let authour: User = users[username];
  let date: Date = new Date();
  let replies: Comment[] = [];
  let likes: number = 0;
  let dislikes: number = 0;
  let commentId: number = commentID++;
  const newComment: Comment = {
    breadText,
    authour,
    date,
    replies,
    likes,
    dislikes,
    commentId,
  };
  thread.replies.push(newComment);
  return {
    statusCode: 200,
    message: "Thread posted successfully",
    thread: thread,
  };
};

export const deleteThread = async (threadId: string) => {
  let thread: Thread = threads[threadId];
  thread.replies.forEach(function (element, index) {
    removeReplies(element);
    delete thread.replies[index];
  });
  delete threads[threadId];
  return {
    statusCode: 200,
    message: "Thread deleted successfully",
  };
};

function removeReplies(reply: Comment) {
  reply.replies.forEach(function (element, index) {
    removeReplies(element);
    delete reply.replies[index];
  });
}

export const postThread = async (
  username: string,
  category: string,
  title: string,
  breadText: string
) => {
  if (categories.includes(category)) {
    let author: User = users[username];
    let threadId: number = id++;
    let date: Date = new Date();
    let replies: Comment[] = [];
    let likes: number = 0;
    let dislikes: number = 0;
    const newThread: Thread = {
      likes,
      dislikes,
      title,
      breadText,
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
    thread: null,
  };
};
