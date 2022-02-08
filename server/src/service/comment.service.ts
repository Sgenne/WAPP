import { Comment } from "../model/comment.interface";
import { Thread } from "../model/thread.interface";
import { User } from "../model/user.interface";

const users: { [key: string]: User } = {};
const comments: { [key: string]: Comment } = {};
let commentID: number = 0;

export const likeComment = async (commentId: number, username: string) => {
  let comment: Comment = comments[commentId];
  let user: User = users[username];
  if (comment.authour.username != "Deleted") {
    if (!user.likedComments.includes(comment)) {
      user.likedComments.push(comment);
      comment.likes++;
    } else {
      let temp: number = user.likedComments.lastIndexOf(comment);
      user.likedComments = user.likedComments.splice(temp, 1);
      comment.likes--;
    }
  }
  return {
    statusCode: 200,
    message: "Comment like status changed successfully",
    comment: comment,
  };
};

export const disLikeComment = async (commentId: number, username: string) => {
  let comment: Comment = comments[commentId];
  let user: User = users[username];
  if (comment.authour.username != "Deleted") {
    if (!user.dislikedComments.includes(comment)) {
      user.dislikedComments.push(comment);
      comment.dislikes++;
    } else {
      let temp: number = user.dislikedComments.lastIndexOf(comment);
      user.dislikedComments = user.dislikedComments.splice(temp, 1);
      comment.dislikes--;
    }
  }
  return {
    statusCode: 200,
    message: "Comment dislike status changed successfully",
    comment: comment,
  };
};

export const editComment = async (commentId: number, content: string) => {
  let comment: Comment = comments[commentId];
  if (comment.authour.username != "Deleted") {
    comment.content = content + "\nedited";
  }
  return {
    statusCode: 200,
    message: "Comment edited successfully",
    comment: comment,
  };
};

export const deleteComment = async (commentId: number) => {
  let comment: Comment = comments[commentId];
  if (comment.authour.username != "Deleted") {
    comment.authour = users["Deleted"];
    comment.content = "";
    comment.dislikes = 0;
    comment.likes = 0;
  }
  return {
    statusCode: 200,
    message: "Comment hidden successfully",
    comment: comment,
  };
};

export const postReply = async (
  commentIdRoot: number,
  content: string,
  username: string
) => {
  let root: Comment = comments[commentIdRoot];
  let authour: User = users[username];
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
  root.replies.push(newComment);
  return {
    statusCode: 200,
    message: "Reply posted successfully",
    comment: newComment,
  };
};
