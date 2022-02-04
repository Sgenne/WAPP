import { Comment } from "../model/comment.interface";
import { Thread } from "../model/thread.interface";
import { User } from "../model/user.interface";

export const likeComment = async (comment: Comment, user: User) => {
  if (comment.authour.userName != "Deleted") {
    if (!user.likedComments.includes(comment)) {
      user.likedComments.push(comment);
      comment.likes++;
    } else {
      let temp: number = user.likedComments.lastIndexOf(comment);
      user.likedComments = user.likedComments.splice(temp, 1);
      comment.likes--;
    }
  }
};

export const disLikeThread = async (comment: Comment, user: User) => {
  if (comment.authour.userName != "Deleted") {
    if (!user.dislikedComments.includes(comment)) {
      user.dislikedComments.push(comment);
      comment.dislikes++;
    } else {
      let temp: number = user.dislikedComments.lastIndexOf(comment);
      user.dislikedComments = user.dislikedComments.splice(temp, 1);
      comment.dislikes--;
    }
  }
};

export const editComment = async (comment: Comment, breadText: string) => {
  if (comment.authour.userName != "Deleted") {
    comment.breadText = breadText + "\nedited";
  }
};

export const deleteComment = async (comment: Comment) => {
  if (comment.authour.userName != "Deleted") {
    comment.authour; //TODO set to deleted authour
    comment.breadText = "";
    comment.dislikes = 0;
    comment.likes = 0;
  }
};
