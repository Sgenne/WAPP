import * as threadServices from "../service/thread.service";
import { Request, Response, Router } from "express";

export const threadRouter = Router();

threadRouter.put("/likeThread", async (req: Request, res: Response) => {
  const threadID = req.body.threadId;
  const username = req.body.username;

  if (!(username && threadID)) {
    return res.status(400).send({ message: "Invalid input." });
  }

  const result = await threadServices.likeThread(threadID, username);

  if (result.statusCode !== 200) {
    return res.status(result.statusCode).send({ message: result.message });
  }

  res.status(200).send({
    message: "Like status changed successfully.",
    thread: result.thread,
  });
});

threadRouter.put("/disLikeThread", async (req: Request, res: Response) => {
  const threadID = req.body.threadId;
  const username = req.body.username;

  if (!(username && threadID)) {
    return res.status(400).send({ message: "Invalid input." });
  }

  const result = await threadServices.disLikeThread(threadID, username);

  if (result.statusCode !== 200) {
    return res.status(result.statusCode).send({ message: result.message });
  }

  res.status(200).send({
    message: "Dislike status changed successfully.",
    thread: result.thread,
  });
});

threadRouter.put("/editThread", async (req: Request, res: Response) => {
  const threadID = req.body.threadId;
  const breadText = req.body.breadText;
  const title = req.body.title;

  if (!(breadText && title && threadID)) {
    return res.status(400).send({ message: "Invalid input." });
  }

  const result = await threadServices.editThread(threadID, breadText, title);

  if (result.statusCode !== 200) {
    return res.status(result.statusCode).send({ message: result.message });
  }

  res.status(200).send({
    message: "Thread edited successfully.",
    thread: result.thread,
  });
});

threadRouter.put("/editThread", async (req: Request, res: Response) => {
  const threadID = req.body.threadId;
  const breadText = req.body.breadText;
  const title = req.body.title;

  if (!(breadText && title && threadID)) {
    return res.status(400).send({ message: "Invalid input." });
  }

  const result = await threadServices.editThread(threadID, breadText, title);

  if (result.statusCode !== 200) {
    return res.status(result.statusCode).send({ message: result.message });
  }

  res.status(200).send({
    message: "Thread edited successfully.",
    thread: result.thread,
  });
});

threadRouter.post("/postThread", async (req: Request, res: Response) => {
  const username = req.body.username;
  const category = req.body.category;
  const title = req.body.title;
  const breadText = req.body.breadText;

  if (!(breadText && title && username && category)) {
    return res.status(400).send({ message: "Invalid input." });
  }

  const result = await threadServices.postThread(
    username,
    category,
    title,
    breadText
  );

  if (result.statusCode !== 200) {
    return res.status(result.statusCode).send({ message: result.message });
  }

  res.status(200).send({
    message: "Thread posted successfully.",
    thread: result.thread,
  });
});

threadRouter.delete("/deleteThread", async (req: Request, res: Response) => {
  const threadId = req.body.threadId;

  if (!threadId) {
    return res.status(400).send({ message: "Invalid input." });
  }

  const result = await threadServices.deleteThread(threadId);

  if (result.statusCode !== 200) {
    return res.status(result.statusCode).send({ message: result.message });
  }

  res.status(200).send({
    message: "Thread posted successfully.",
    thread: result.thread,
  });
});
