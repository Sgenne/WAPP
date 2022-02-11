import { Comment } from "../model/comment.interface";
import { User } from "../model/user.interface";
import { users } from "./user.service";
import { newComment } from "./thread.service";

export const comments: { [key: string]: Comment } = {};

/**
 * The result of a comment service.
 */
interface CommentServiceResult {
  /**
   * An HTTP status code describing the result of the attempted operation.
   */
  statusCode: number;

  /**
   * A message describing the result of the attempted operation.
   */
  message: string;

  /**
   * The comment that was acted upon.
   */
  comment?: Comment;
}

export const likeComment = async (
  commentId: number,
  userId: number
): Promise<CommentServiceResult> => {
  let comment: Comment = comments[commentId];
  let user: User = users[userId];

  if (comment.authour.username != "Deleted") {
    if (user.dislikedComments.includes(comment)) {
      let temp: number = user.dislikedComments.lastIndexOf(comment);
      user.dislikedComments.splice(temp, 1);
      comment.dislikes--;
    }
    if (!user.likedComments.includes(comment)) {
      user.likedComments.push(comment);
      comment.likes++;
    } else {
      let temp: number = user.likedComments.lastIndexOf(comment);
      user.likedComments.splice(temp, 1);
      comment.likes--;
    }
    return {
      statusCode: 200,
      message: "Comment like status changed successfully",
      comment: comment,
    };
  } else {
    return {
      statusCode: 400,
      message: "Comment or User doesnt exist",
      comment: undefined,
    };
  }
};

export const disLikeComment = async (
  commentId: number,
  userId: number
): Promise<CommentServiceResult> => {
  let comment: Comment = comments[commentId];
  let user: User = users[userId];
  if (comment.authour.username != "Deleted") {
    if (user.likedComments.includes(comment)) {
      let temp: number = user.likedComments.lastIndexOf(comment);
      user.likedComments.splice(temp, 1);
      comment.dislikes--;
    }
    if (!user.dislikedComments.includes(comment)) {
      user.dislikedComments.push(comment);
      comment.dislikes++;
    } else {
      let temp: number = user.dislikedComments.lastIndexOf(comment);
      user.dislikedComments.splice(temp, 1);
      comment.dislikes--;
    }
  }
  return {
    statusCode: 200,
    message: "Comment dislike status changed successfully",
    comment: comment,
  };
};

export const editComment = async (
  commentId: number,
  content: string,
  userId: number
): Promise<CommentServiceResult> => {
  let comment: Comment = comments[commentId];

  if (comment.authour.userId !== userId) {
    return {
      statusCode: 403,
      message: "The user does not have permission to edit this comment.",
    };
  }

  if (comment.authour.username != "Deleted") {
    comment.content = content + "\nedited";
  }
  return {
    statusCode: 200,
    message: "Comment edited successfully",
    comment: comment,
  };
};

export const deleteComment = async (
  commentId: number,
  userId: number
): Promise<CommentServiceResult> => {
  let comment: Comment = comments[commentId];

  if (comment.authour.userId !== userId) {
    return {
      statusCode: 403,
      message: "The user does not have permission to delete thic comment.",
    };
  }

  if (comment.authour.username !== "Deleted") {
    comment.authour = users[0];
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
  userId: number
): Promise<CommentServiceResult> => {
  let root: Comment = comments[commentIdRoot];
  let authour: User = users[userId];
  let date: Date = new Date();
  let replies: Comment[] = [];
  let likes: number = 0;
  let dislikes: number = 0;
  let commentId: number = getCommentID();
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
    statusCode: 201,
    message: "Reply posted successfully",
    comment: newComment,
  };
};

function getCommentID(): number {
  return newComment();
}
