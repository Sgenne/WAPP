import * as commentService from "../service/comment.service";
import { Request, Response, Router } from "express";
import {
  handleValidationResult,
  hasContent,
  hasUsername,
  hasValidCommentId,
  hasValidUserId,
} from "../utils/validation.util";
import { isAuthenticated } from "../utils/auth.util";

export const commentRouter = Router();

/**
 * Adds a like by a specified user to a specified comment.
 */
commentRouter.put(
  "/likeComment",
  hasValidCommentId,
  hasUsername,
  handleValidationResult,
  isAuthenticated,
  async (req: Request, res: Response) => {
    const commentID = req.body.commentID;
    const userId = req.body.userId;

    const result = await commentService.likeComment(commentID, userId);

    if (result.statusCode !== 200) {
      return res.status(result.statusCode).send({ message: result.message });
    }

    res.status(200).send({
      message: "Like status changed successfully.",
      comment: result.comment,
    });
  }
);

/**
 * Adds a dislike by a specified user to a specified comment.
 */
commentRouter.put(
  "/disLikeComment",
  hasValidCommentId,
  hasUsername,
  handleValidationResult,
  isAuthenticated,
  async (req: Request, res: Response) => {
    const commentID = req.body.commentID;
    const userId = req.body.userId;

    const result = await commentService.disLikeComment(commentID, userId);

    if (result.statusCode !== 200) {
      return res.status(result.statusCode).send({ message: result.message });
    }

    res.status(200).send({
      message: "Like status changed successfully.",
      comment: result.comment,
    });
  }
);

/**
 * Allows the creator of a comment to edit that comment.
 */
commentRouter.put(
  "/editComment",
  hasValidCommentId,
  hasContent,
  handleValidationResult,
  isAuthenticated,
  async (req: Request, res: Response) => {
    const commentID = req.body.commentID;
    const content = req.body.content;
    const userId = req.body.userId;

    const result = await commentService.editComment(commentID, content, userId);

    if (result.statusCode !== 200) {
      return res.status(result.statusCode).send({ message: result.message });
    }

    res.status(200).send({
      message: "Like status changed successfully.",
      comment: result.comment,
    });
  }
);

/**
 * Allows the creator of a comment to delete that comment.
 */
commentRouter.put(
  "/deleteComment",
  hasValidCommentId,
  handleValidationResult,
  isAuthenticated,
  async (req: Request, res: Response) => {
    const commentID = req.body.commentID;
    const userId = req.body.userId;

    const result = await commentService.deleteComment(commentID, userId);

    if (result.statusCode !== 200) {
      return res.status(result.statusCode).send({ message: result.message });
    }

    res.status(200).send({
      message: "Like status changed successfully.",
      comment: result.comment,
    });
  }
);

/**
 * Adds a reply by a specified user to a specified comment.
 */
commentRouter.post(
  "/reply",
  hasContent,
  hasValidUserId,
  handleValidationResult,
  isAuthenticated,
  async (req: Request, res: Response) => {
    const id = req.body.commentID;
    const content = req.body.content;
    const username = req.body.userId;

    if (!(content && id && username)) {
      return res.status(400).send({ message: "Invalid input." });
    }

    const result = await commentService.postReply(id, content, username);

    if (result.statusCode !== 201) {
      return res.status(result.statusCode).send({ message: result.message });
    }

    res.status(201).send({
      message: "Like status changed successfully.",
      comment: result.comment,
    });
  }
);

/**
 * Returns all comments that have been liked by a specified user.
 */
commentRouter.get(
  "/likedComments/:userId",
  async (req: Request, res: Response) => {
    const userId = req.params.userId;

    const result = await commentService.getLikedComments(+userId);

    res
      .status(result.statusCode)
      .send({ message: result.message, comments: result.comments });
  }
);

/**
 * Returns all comments that have been created by a specified user.
 */
commentRouter.get("/author/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const result = await commentService.getCommentsByAuthor(+userId);

  res
    .status(result.statusCode)
    .send({ message: result.message, comments: result.comments });
});

/**
 * Returns one comment specified by the given comment-id.
 */
commentRouter.get("/:commentId", async (req: Request, res: Response) => {
  const commentId = req.params.commentId;

  const result = await commentService.getComment(+commentId);

  if (result.statusCode !== 200) {
    return res.status(result.statusCode).send({ message: result.message });
  }

  res.status(200).send({ message: result.message, comment: result.comment });
});
