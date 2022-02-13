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
  const comment: Comment = comments[commentId];
  const user: User = users[userId];

  if (users[comment.authour].username === "Deleted") {
    return {
      statusCode: 400,
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
  const comment: Comment = comments[commentId];
  const user: User = users[userId];

  if (users[comment.authour].username === "Deleted") {
    return {
      statusCode: 400,
      message: "The specified comment is deleted.",
    };
  }

  if (user.likedComments.includes(commentId)) {
    user.likedComments = user.likedComments.filter(
      (elem) => elem !== commentId
    );
    comment.dislikes--;
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
  const comment = comments[commentId];
  if (comment) {
    return {
      statusCode: 200,
      message: "Comment has successfully been recived.",
      comment: comment,
    };
  }
  return {
    statusCode: 404,
    message: "Comment could not be found",
    comment: comment,
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
  const comment: Comment = comments[commentId];

  if (comment.authour !== userId) {
    return {
      statusCode: 403,
      message: "The user does not have permission to edit this comment.",
    };
  }

  if (users[comment.authour].username !== "Deleted") {
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
  const comment: Comment = comments[commentId];

  if (comment.authour !== userId) {
    return {
      statusCode: 403,
      message: "The user does not have permission to delete thic comment.",
    };
  }

  if (users[comment.authour].username === "Deleted") {
    return {
      statusCode: 403,
      message: "The comment is already deleted.",
    };
  }

  comment.authour = 0;
  comment.content = "";
  comment.dislikes = 0;
  comment.likes = 0;

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
  let root: Comment = comments[commentIdRoot];
  let authour: number = userId;
  let date: Date = new Date();
  let replies: number[] = [];
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
  root.replies.push(commentId);
  return {
    statusCode: 201,
    message: "Reply posted successfully",
    comment: newComment,
  };
};

function getCommentID(): number {
  return newComment();
}
