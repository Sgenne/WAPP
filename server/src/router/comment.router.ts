import * as commentService from "../service/comment.service";
import { Request, Response, Router } from "express";

export const commentRouter = Router();

commentRouter.put("/likeComment", async (req: Request, res: Response) => {
  const commentID = req.body.commentID;
  const username = req.body.username;

  if (!(username && commentID)) {
    return res.status(400).send({ message: "Invalid input." });
  }

  const result = await commentService.likeComment(commentID, username);

  if (result.statusCode !== 200) {
    return res.status(result.statusCode).send({ message: result.message });
  }

  res.status(200).send({
    message: "Like status changed successfully.",
    comment: result.comment,
  });
});

commentRouter.put("/disLikeComment", async (req: Request, res: Response) => {
  const commentID = req.body.commentID;
  const username = req.body.username;

  if (!(username && commentID)) {
    return res.status(400).send({ message: "Invalid input." });
  }

  const result = await commentService.disLikeComment(commentID, username);

  if (result.statusCode !== 200) {
    return res.status(result.statusCode).send({ message: result.message });
  }

  res.status(200).send({
    message: "Like status changed successfully.",
    comment: result.comment,
  });
});

commentRouter.put("/editComment", async (req: Request, res: Response) => {
  const commentID = req.body.commentID;
  const breadText = req.body.breadText;

  if (!(breadText && commentID)) {
    return res.status(400).send({ message: "Invalid input." });
  }

  const result = await commentService.editComment(commentID, breadText);

  if (result.statusCode !== 200) {
    return res.status(result.statusCode).send({ message: result.message });
  }

  res.status(200).send({
    message: "Like status changed successfully.",
    comment: result.comment,
  });
});

commentRouter.put("/deleteComment", async (req: Request, res: Response) => {
  const commentID = req.body.commentID;

  if (!commentID) {
    return res.status(400).send({ message: "Invalid input." });
  }

  const result = await commentService.deleteComment(commentID);

  if (result.statusCode !== 200) {
    return res.status(result.statusCode).send({ message: result.message });
  }

  res.status(200).send({
    message: "Like status changed successfully.",
    comment: result.comment,
  });
});

commentRouter.put("/editComment", async (req: Request, res: Response) => {
  const commentID = req.body.commentID;
  const breadText = req.body.breadText;
  const username = req.body.username;

  if (!(breadText && commentID && username)) {
    return res.status(400).send({ message: "Invalid input." });
  }

  const result = await commentService.postReply(commentID, breadText, username);

  if (result.statusCode !== 200) {
    return res.status(result.statusCode).send({ message: result.message });
  }

  res.status(200).send({
    message: "Like status changed successfully.",
    comment: result.comment,
  });
});
