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
import { isAuthenticated } from "../utils/auth.util";
import { threadId } from "worker_threads";
import { getUser } from "../service/user.service";

export const threadRouter = Router();

threadRouter.put(
  "/likeThread",
  hasValidThreadId,
  hasUsername,
  handleValidationResult,
  isAuthenticated,
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
  handleValidationResult,
  isAuthenticated,
  async (req: Request, res: Response) => {
    const threadID = req.body.threadId;
    const userId = req.body.userId;

    const result = await threadServices.disLikeThread(threadID, userId);

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
  isAuthenticated,
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
  "/commentThread",
  hasValidThreadId,
  hasContent,
  handleValidationResult,
  isAuthenticated,
  async (req: Request, res: Response) => {
    const threadID = req.body.threadId;
    const content = req.body.content;
    const userId = req.body.userId;

    const result = await threadServices.commentThread(
      userId,
      threadID,
      content
    );

    if (result.statusCode !== 201) {
      return res.status(result.statusCode).send({ message: result.message });
    }

    res.status(200).send({
      message: "Comment posted successfully.",
      thread: result.thread,
    });
  }
);

threadRouter.post(
  "/postThread",
  hasCategory,
  hasValidThreadTitle,
  hasContent,
  handleValidationResult,
  isAuthenticated,
  async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const category = req.body.category;
    const title = req.body.title;
    const content = req.body.content;

    const result = await threadServices.postThread(
      userId,
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

threadRouter.get("/:threadId", async (req: Request, res: Response) => {
  const threadId = req.params.threadId;

  const result = await threadServices.getThread(+threadId);

  if (result.statusCode !== 200) {
    return res.status(result.statusCode).send({ message: result.message });
  }

  res.status(200).send({ message: result.message, user: result.thread });
});

threadRouter.get("/author/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const result = await threadServices.getThreadsByAuthor(+userId);

  if (!result.threads) {
    res.status(result.statusCode).send({ message: result.message });
    return;
  }

  res.status(200).send({ message: result.message, threads: result.threads });
});

threadRouter.get(
  "/liked/:userId",
 async (req: Request, res: Response) => {
  console.log("Begin");
  
  const userId = req.params.userId;

   const result = await threadServices.getLikedThreads(+userId);

   if(!result.thread){
    res.status(result.statusCode).send({message: result.message});
    return;
   }
   
   console.log(result.threads);
   res.status(200).send({message: result.message, threads: result.threads});
   
 }
);
threadRouter.delete(
  "/deleteThread",
  hasValidThreadId,
  handleValidationResult,
  isAuthenticated,
  async (req: Request, res: Response) => {
    const threadId = req.body.threadId;
    const userId = req.body.userId;

    const result = await threadServices.deleteThread(threadId, userId);

    if (result.statusCode !== 200) {
      return res.status(result.statusCode).send({ message: result.message });
    }

    res.status(200).send({
      message: "Thread deleted successfully.",
    });
  }
);
