import * as commentService from "../service/comment.service";
import { Request, Response, Router } from "express";
import {
  handleValidationResult,
  hasContent,
  hasUsername,
  hasValidCommentId,
} from "../utils/validation.util";
import { isAuthenticated } from "../utils/auth.util";

export const commentRouter = Router();

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

commentRouter.put(
  "/replyComment",
  hasValidCommentId,
  hasContent,
  hasUsername,
  handleValidationResult,
  isAuthenticated,
  async (req: Request, res: Response) => {
    const commentID = req.body.commentID;
    const content = req.body.content;
    const username = req.body.username;

    if (!(content && commentID && username)) {
      return res.status(400).send({ message: "Invalid input." });
    }

    const result = await commentService.postReply(commentID, content, username);

    if (result.statusCode !== 200) {
      return res.status(result.statusCode).send({ message: result.message });
    }

    res.status(201).send({
      message: "Like status changed successfully.",
      comment: result.comment,
    });
  }
);
