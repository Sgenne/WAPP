import * as threadServices from "../service/thread.service";
import { Request, Response, Router } from "express";
import {
  handleValidationResult,
  hasCategory,
  hasContent,
  hasValidThreadId,
  hasValidThreadTitle,
  hasValidUserId,
} from "../utils/validation.util";
import { isAuthenticated } from "../utils/auth.util";

export const threadRouter = Router();

/**
 * Adds a like from a specified user to a specified thread.
 */
threadRouter.put(
  "/likeThread",
  hasValidUserId,
  hasValidThreadId,
  handleValidationResult,
  isAuthenticated,
  async (req: Request, res: Response) => {
    const threadID = req.body.threadId;
    const userId = req.body.userId;

    const result = await threadServices.likeThread(threadID, userId);

    if (result.statusCode !== 200) {
      return res.status(result.statusCode).send({ message: result.message });
    }

    res.status(200).send({
      message: "Like status changed successfully.",
      thread: result.thread,
    });
  }
);

/**
 * Adds a dislike by a specified user to a specified thread.
 */
threadRouter.put(
  "/dislikeThread",
  hasValidUserId,
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

/**
 * Allows the creator of a thread to edit the thread's content and title.
 */
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

/**
 * Adds a reply to a specified thread.
 */
threadRouter.post(
  "/reply",
  hasContent,
  handleValidationResult,
  isAuthenticated,
  async (req: Request, res: Response) => {
    const id = req.body.threadId;
    const content = req.body.content;
    const userId = req.body.userId;
    console.log(id);

    const result = await threadServices.commentThread(userId, id, content);

    if (result.statusCode !== 201) {
      return res.status(result.statusCode).send({ message: result.message });
    }

    res.status(201).send({
      message: "Comment posted successfully.",
      thread: result.thread,
    });
  }
);

/**
 * Creates a thread.
 */
threadRouter.post(
  "/postThread",
  hasCategory,
  hasValidThreadTitle,
  hasContent,
  handleValidationResult,
  isAuthenticated,
  async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const categoryId = +req.body.categoryId;
    const title = req.body.title;
    const content = req.body.content;

    const result = await threadServices.postThread(
      userId,
      categoryId,
      title,
      content
    );

    if (result.statusCode !== 201) {
      return res.status(result.statusCode).send({ message: result.message });
    }

    res.status(201).send({
      message: "Thread posted successfully.",
      thread: result.thread,
    });
  }
);

/**
 * Returns all available categories.
 */
threadRouter.get("/categories", async (req: Request, res: Response) => {
  const result = await threadServices.getCategories();

  if (result.statusCode !== 200) {
    return res.status(result.statusCode).send({ message: result.message });
  }

  res
    .status(200)
    .send({ message: result.message, categories: result.categories });
});

/**
 * Returns all threads from a specified category.
 */
threadRouter.get(
  "/categoryThreads/:categoryId",
  async (req: Request, res: Response) => {
    const result = await threadServices.getCategoryThreads(
      +req.params.categoryId
    );

    if (result.statusCode !== 200) {
      return res.status(result.statusCode).send({ message: result.message });
    }

    res.status(200).send({ message: result.message, threads: result.threads });
  }
);

/**
 * Returns three sample threads from the specified category.
 */
threadRouter.get(
  "/sampleThreads/:categoryId",
  async (req: Request, res: Response) => {
    const result = await threadServices.getSampleThreads(
      +req.params.categoryId
    );

    if (result.statusCode !== 200) {
      return res.status(result.statusCode).send({ message: result.message });
    }

    res.status(200).send({ message: result.message, threads: result.threads });
  }
);

/**
 * Returns all replies to a specific comment.
 */
threadRouter.get(
  "/commentComments/:commentId",
  async (req: Request, res: Response) => {
    const result = await threadServices.getCommentComments(
      +req.params.commentId
    );

    if (result.statusCode !== 200) {
      return res.status(result.statusCode).send({ message: result.message });
    }

    res
      .status(200)
      .send({ message: result.message, comments: result.comments });
  }
);

/**
 * Returns all threads that have been created by a specified user.
 */
threadRouter.get("/author/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const result = await threadServices.getThreadsByAuthor(+userId);

  if (!result.threads) {
    res.status(result.statusCode).send({ message: result.message });
    return;
  }

  res.status(200).send({ message: result.message, threads: result.threads });
});

/**
 * Returns all threads that have been liked by a specified user.
 */
threadRouter.get("/liked/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const result = await threadServices.getLikedThreads(+userId);

  if (!result.threads) {
    res.status(result.statusCode).send({ message: result.message });
    return;
  }
  res.status(200).send({ message: result.message, threads: result.threads });
});

/**
 * Deletes a specified thread.
 */
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

/**
 * Returns the thread with the given thread-id.
 */
threadRouter.get("/:threadId", async (req: Request, res: Response) => {
  const threadId = +req.params.threadId;

  const result = await threadServices.getThread(threadId);

  if (result.statusCode !== 200) {
    return res.status(result.statusCode).send({ message: result.message });
  }

  res.status(200).send({ message: result.message, thread: result.thread });
});
