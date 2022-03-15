import { Comment } from "../model/comment.interface";
import { User } from "../model/user.interface";
import { getUser, UserServiceResult } from "./user.service";
import { commentModel } from "../db/comment.db";
import { userModel } from "../db/user.db";

/**
 * The result of a comment service. Contains a status code and message describing the
 * result of the attempted service. If the service was successful, then the result
 * will contain the comment or comments that were acted upon.
 */
export interface CommentServiceResult {
  statusCode: number;
  message: string;
  comment?: Comment;
  comments?: Comment[];
}

/**
 * User liking a comment.
 *
 * @param commentId - Id of the comment the user tries to like.
 *
 * @param userId - Id of the user trying to like.
 */
export const likeComment = async (
  commentId: number,
  userId: number
): Promise<CommentServiceResult> => {
  const commentResult: CommentServiceResult = await getComment(commentId);
  const userResult: UserServiceResult = await getUser(userId);

  const comment = commentResult.comment;
  const user = userResult.user;

  if (!comment) {
    return commentResult;
  }

  if (!user) {
    return userResult;
  }

  if (comment.isDeleted) {
    return {
      statusCode: 405,
      message: "The specified comment is deleted.",
    };
  }

  if (user.dislikedComments.includes(commentId)) {
    user.dislikedComments = user.dislikedComments.filter(
      (elem) => elem !== commentId
    );
    comment.dislikes--;
  }
  if (!user.likedComments.includes(commentId)) {
    user.likedComments.push(commentId);
    comment.likes++;
  } else {
    user.likedComments = user.likedComments.filter(
      (elem) => elem !== commentId
    );
    comment.likes--;
  }

  await userModel.updateOne({ userId: userId }, user);
  await commentModel.updateOne({ commentId: commentId }, comment);

  return {
    statusCode: 200,
    message: "Comment like status changed successfully.",
    comment: comment,
  };
};

/**
 * User disliking a comment.
 *
 * @param commentId - Id of the comment the user tries to dislike.
 *
 * @param userId - Id of the user trying to dislike
 */
export const dislikeComment = async (
  commentId: number,
  userId: number
): Promise<CommentServiceResult> => {
  const commentResult: CommentServiceResult = await getComment(commentId);
  const userResult: UserServiceResult = await getUser(userId);

  const comment = commentResult.comment;
  const user = userResult.user;

  if (!comment) {
    return commentResult;
  }
  if (!user) {
    return userResult;
  }

  if (comment.isDeleted) {
    return {
      statusCode: 400,
      message: "The specified comment is deleted.",
    };
  }

  if (user.likedComments.includes(commentId)) {
    user.likedComments = user.likedComments.filter(
      (elem) => elem !== commentId
    );
    comment.likes--;
  }
  if (!user.dislikedComments.includes(commentId)) {
    user.dislikedComments.push(commentId);
    comment.dislikes++;
  } else {
    user.dislikedComments = user.dislikedComments.filter(
      (elem) => elem !== commentId
    );
    comment.dislikes--;
  }

  await userModel.updateOne({ userId: userId }, user);
  await commentModel.updateOne({ commentId: commentId }, comment);

  return {
    statusCode: 200,
    message: "Comment dislike status changed successfully.",
    comment: comment,
  };
};

/**
 *
 * @param commentId - The id of the comment to get.
 */
export const getComment = async (
  commentId: number
): Promise<CommentServiceResult> => {
  const comment: Comment | null = await commentModel.findOne({
    commentId: commentId,
  });

  if (!comment) {
    return {
      statusCode: 404,
      message: "Comment could not be found",
    };
  }

  return {
    statusCode: 200,
    message: "Comment has successfully been recived.",
    comment: comment,
  };
};

/**
 * Returns the comments from a specified user.
 *
 * @param userId The id of the author of the returned comments.
 */
export const getCommentsByAuthor = async (
  userId: number
): Promise<CommentServiceResult> => {
  const result: UserServiceResult = await getUser(userId);

  const user = result.user;

  if (!user) {
    return result;
  }

  const createdComments: Comment[] = await commentModel.find({
    author: userId,
  });

  return {
    statusCode: 200,
    message: "The created comments were found and returned successfully.",
    comments: createdComments,
  };
};

/**
 * Returns the comments liked by a specified user.
 *
 * @param userId - The id of the user.
 */
export const getLikedComments = async (
  userId: number
): Promise<CommentServiceResult> => {
  const userResult: UserServiceResult = await getUser(userId);

  const user = userResult.user;

  if (!user) {
    return userResult;
  }

  const likedComments = await commentModel.find({
    commentId: { $in: user.likedComments },
  });

  return {
    statusCode: 200,
    message: "The liked comments were found and returned successfully.",
    comments: likedComments,
  };
};

/**
 * User changes the content of a comment.
 *
 * @param commentId - Id of the comment being changed.
 *
 * @param content - The new content for the comment.
 *
 * @param userId - Id of the user trying to change the comment.
 */
export const editComment = async (
  commentId: number,
  content: string,
  userId: number
): Promise<CommentServiceResult> => {
  const commentResult: CommentServiceResult = await getComment(commentId);
  const comment = commentResult.comment;

  if (!comment) {
    return {
      statusCode: 404,
      message: "The comment doesen't exist.",
    };
  }

  if (comment.author !== userId) {
    return {
      statusCode: 403,
      message: "The user does not have permission to edit this comment.",
    };
  }

  if (comment.isDeleted) {
    return {
      statusCode: 405,
      message: "The comment is already deleted.",
    };
  }

  const today: Date = new Date();
  const month:number = today.getMonth() +1;
  const date: string =
    "\nlast edited " +
    today.getFullYear() +
    "-" +
    month +
    "-" +
    today.getDate();
  content += date;
  comment.content = content;

  await commentModel.updateOne({ commentId: commentId }, comment);

  return {
    statusCode: 200,
    message: "Comment edited successfully.",
    comment: comment,
  };
};

/**
 * User removes their comment from a thread.
 *
 * @param commentId - Id of the comment being removed.
 *
 * @param userId - Id of the user trying to remove the comment.
 */
export const deleteComment = async (
  commentId: number,
  userId: number
): Promise<CommentServiceResult> => {
  const commentResult: CommentServiceResult = await getComment(commentId);

  const comment = commentResult.comment;

  if (!comment) {
    return commentResult;
  }

  if (comment.isDeleted) {
    return {
      statusCode: 405,
      message: "The comment is already deleted.",
    };
  }

  if (comment.author !== userId) {
    return {
      statusCode: 403,
      message: "The user does not have permission to delete thic comment.",
    };
  }

  comment.author = 0;
  comment.content = "";
  comment.dislikes = 0;
  comment.likes = 0;
  comment.isDeleted = true;

  await commentModel.updateOne({ commentId: commentId }, comment);

  return {
    statusCode: 200,
    message: "Comment deleted successfully.",
    comment: comment,
  };
};

/**
 * User posts a reply to a comment.
 *
 * @param commentIdRoot - Id of the root comment that the user is replying to.
 *
 * @param content - The content of the comment.
 *
 * @param userId - Id of the user making the comment.
 */
export const postReply = async (
  commentIdRoot: number,
  content: string,
  userId: number
): Promise<CommentServiceResult> => {
  const userResult: UserServiceResult = await getUser(userId);
  const rootCommentResult: CommentServiceResult = await getComment(
    commentIdRoot
  );
  const parentComment: Comment | undefined = rootCommentResult.comment;
  const user: User | undefined = userResult.user;

  if (!user) {
    return userResult;
  }

  if (!parentComment) {
    return {
      statusCode: 404,
      message: "No comment with the given parent comment id exists.",
    };
  }

  const author: number = userId;
  const date: Date = new Date();
  const replies: number[] = [];
  const likes: number = 0;
  const dislikes: number = 0;
  const commentId: number = new Date().getTime();
  const rootThread: number = parentComment.rootThread;
  const newComment: Comment = {
    content,
    author,
    date,
    replies,
    likes,
    dislikes,
    commentId,
    rootThread,
    isDeleted: false,
  };
  parentComment.replies.push(commentId);
  await commentModel.create(newComment);
  await commentModel.updateOne(
    { commentId: commentIdRoot },
    { replies: parentComment.replies }
  );

  return {
    statusCode: 201,
    message: "Reply posted successfully",
    comment: newComment,
  };
};

/**
 * Returns all replies to a specific root comment.
 *
 * @param rootId - The id of the root comment.
 */
export const getCommentComments = async (
  rootId: number
): Promise<CommentServiceResult> => {
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
