import * as threadServices from "../service/thread.service";
import { Request, Response, Router } from "express";
import {
  handleValidationResult,
  hasCategory,
  hasContent,
  hasUsername,
  hasValidThreadId,
  hasValidThreadTitle,
} from "../utils/validation.util";

export const threadRouter = Router();

threadRouter.put(
  "/likeThread",
  hasValidThreadId,
  hasUsername,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const threadID = req.body.threadId;
    const username = req.body.username;

    const result = await threadServices.likeThread(threadID, username);

    if (result.statusCode !== 200) {
      return res.status(result.statusCode).send({ message: result.message });
    }

    res.status(200).send({
      message: "Like status changed successfully.",
      thread: result.thread,
    });
  }
);

threadRouter.put(
  "/disLikeThread",
  hasValidThreadId,
  hasUsername,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const threadID = req.body.threadId;
    const username = req.body.username;

    const result = await threadServices.disLikeThread(threadID, username);

    if (result.statusCode !== 200) {
      return res.status(result.statusCode).send({ message: result.message });
    }

    res.status(200).send({
      message: "Dislike status changed successfully.",
      thread: result.thread,
    });
  }
);

threadRouter.put(
  "/editThread",
  hasValidThreadId,
  hasContent,
  hasValidThreadTitle,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const threadID = req.body.threadId;
    const content = req.body.content;
    const title = req.body.title;

    const result = await threadServices.editThread(threadID, content, title);

    if (result.statusCode !== 200) {
      return res.status(result.statusCode).send({ message: result.message });
    }

    res.status(200).send({
      message: "Thread edited successfully.",
      thread: result.thread,
    });
  }
);

threadRouter.put(
  "/editThread",
  hasValidThreadId,
  hasContent,
  hasValidThreadTitle,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const threadID = req.body.threadId;
    const content = req.body.content;
    const title = req.body.title;

    const result = await threadServices.editThread(threadID, content, title);

    if (result.statusCode !== 200) {
      return res.status(result.statusCode).send({ message: result.message });
    }

    res.status(200).send({
      message: "Thread edited successfully.",
      thread: result.thread,
    });
  }
);

threadRouter.post(
  "/postThread",
  hasUsername,
  hasCategory,
  hasValidThreadTitle,
  hasContent,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const username = req.body.username;
    const category = req.body.category;
    const title = req.body.title;
    const content = req.body.content;

    const result = await threadServices.postThread(
      username,
      category,
      title,
      content
    );

    if (result.statusCode !== 200) {
      return res.status(result.statusCode).send({ message: result.message });
    }

    res.status(200).send({
      message: "Thread posted successfully.",
      thread: result.thread,
    });
  }
);

threadRouter.delete(
  "/deleteThread",
  hasValidThreadId,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const threadId = req.body.threadId;

    const result = await threadServices.deleteThread(threadId);

    if (result.statusCode !== 200) {
      return res.status(result.statusCode).send({ message: result.message });
    }

    res.status(200).send({
      message: "Thread posted successfully.",
    });
  }
);
