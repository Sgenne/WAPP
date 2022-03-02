import { Comment } from "../model/comment.interface";
import { User } from "../model/user.interface";
import { getUser, UserServiceResult } from "./user.service";
import { commentModel } from "../db/comment.db";
import { userModel } from "../db/user.db";

/**
 * The result of a comment service.
 */
export interface CommentServiceResult {
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

  comments?: Comment[];
}

/**
 * user liking a comment
 * @param commentId - id of the comment the user tries to like
 * @param userId - id of the user trying to like
 * @returns - the liked comment
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
      statusCode: 400,
      message: "The specified comment is deleted.",
    };
  }

  let updatedLikes = comment.likes;
  let updatedLikedComments = user.likedComments;
  let updatedDislikedComments = user.dislikedComments;

  if (user.dislikedComments.includes(commentId)) {
    updatedDislikedComments = user.dislikedComments.filter(
      (elem) => elem !== commentId
    );

    if (!user.likedComments.includes(commentId)) {
      updatedLikedComments = [...user.likedComments, commentId];
      updatedLikes++;
    } else {
      updatedLikedComments = user.likedComments.filter(
        (elem) => elem !== commentId
      );
      updatedLikes--;
    }
  }

  userModel.updateOne(
    { userId: userId },
    {
      dislikedComments: updatedDislikedComments,
      likedComments: updatedLikedComments,
    }
  );
  commentModel.updateOne({ commentId: commentId }, { likes: updatedLikes });

  comment.likes = updatedLikes;

  return {
    statusCode: 200,
    message: "Comment like status changed successfully.",
    comment: comment,
  };
};

/**
 * user disliking a comment
 * @param commentId - id of the comment the user tries to dislike
 * @param userId - id of the user trying to dislike
 * @returns - the disliked comment
 */
export const disLikeComment = async (
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

  let updatedDislikes = comment.dislikes;
  let updatedLikedComments = user.likedComments;
  let updatedDislikedComments = user.dislikedComments;

  if (user.likedComments.includes(commentId)) {
    updatedLikedComments = user.likedComments.filter(
      (elem) => elem !== commentId
    );
    updatedDislikes--;
  }

  if (!user.dislikedComments.includes(commentId)) {
    updatedDislikedComments = [...user.dislikedComments, commentId];
    updatedDislikes++;
  } else {
    updatedDislikedComments = user.dislikedComments.filter(
      (elem) => elem !== commentId
    );
    updatedDislikes--;
  }

  userModel.updateOne(
    { userId: userId },
    {
      dislikedComments: updatedDislikedComments,
      likedComments: updatedLikedComments,
    }
  );
  commentModel.updateOne(
    { commentId: commentId },
    { dislikes: updatedDislikes }
  );

  comment.dislikes = updatedDislikes;

  return {
    statusCode: 200,
    message: "Comment dislike status changed successfully.",
    comment: comment,
  };
};

/**
 *
 * @param commentId The id of the comment to get
 *
 * @returns a comment with the specified id
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
 * @param userId - The id of the author of the returned comments.
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
 * user changes the content of a comment
 * @param commentId - id of the comment being changed
 * @param content - the new content for the comment
 * @param userId - id of the user trying to change the comment
 * @returns - the edited comment
 */
export const editComment = async (
  commentId: number,
  content: string,
  userId: number
): Promise<CommentServiceResult> => {
  const commentResult: CommentServiceResult = await getComment(commentId);
  const comment = commentResult.comment;

  if (!comment) {
    return commentResult;
  }

  if (comment.author !== userId) {
    return {
      statusCode: 403,
      message: "The user does not have permission to edit this comment.",
    };
  }

  if (!comment.isDeleted) {
    comment.content = content + "\nedited";
  }

  return {
    statusCode: 200,
    message: "Comment edited successfully.",
    comment: comment,
  };
};
/**
 * user removes their comment from a thread
 * @param commentId - id of the comment being removed
 * @param userId - id of the user trying to remove the comment
 * @returns - the blank/delted comment
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

  if (comment.author !== userId) {
    return {
      statusCode: 403,
      message: "The user does not have permission to delete thic comment.",
    };
  }

  if (comment.isDeleted) {
    return {
      statusCode: 403,
      message: "The comment is already deleted.",
    };
  }

  comment.author = 0;
  comment.content = "";
  comment.dislikes = 0;
  comment.likes = 0;
  comment.isDeleted = true;

  commentModel.updateOne({ commentId: commentId }, comment);

  return {
    statusCode: 200,
    message: "Comment deleted successfully.",
    comment: comment,
  };
};
/**
 * user posts a reply to a comment
 * @param commentIdRoot - id of the root comment that the user is replying to
 * @param content - the content of the comment
 * @param userId - userID of the user making the comment
 * @returns - the reply that was posted
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

  commentModel.create(newComment);
  commentModel.updateOne({ commentId: commentIdRoot }, parentComment);

  return {
    statusCode: 201,
    message: "Reply posted successfully",
    comment: newComment,
  };
};
