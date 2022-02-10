import * as commentService from "../service/comment.service";
import { Request, Response, Router } from "express";
import {
  handleValidationResult,
  hasContent,
  hasUsername,
  hasValidCommentId,
} from "../utils/validation.util";

export const commentRouter = Router();

commentRouter.put(
  "/likeComment",
  hasValidCommentId,
  hasUsername,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const commentID = req.body.commentID;
    const username = req.body.username;

    const result = await commentService.likeComment(commentID, username);

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
  async (req: Request, res: Response) => {
    const commentID = req.body.commentID;
    const username = req.body.username;

    const result = await commentService.disLikeComment(commentID, username);

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
  async (req: Request, res: Response) => {
    const commentID = req.body.commentID;
    const content = req.body.content;

    const result = await commentService.editComment(commentID, content);

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
  async (req: Request, res: Response) => {
    const commentID = req.body.commentID;

    const result = await commentService.deleteComment(commentID);

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

    res.status(200).send({
      message: "Like status changed successfully.",
      comment: result.comment,
    });
  }
);
