import express, { Request, Response } from "express";
import { commentRouter } from "./router/comment.router";
import { threadRouter } from "./router/thread.router";
import { userRouter } from "./router/user.router";
export const app = express();
app.use(express.json());

app.use("/user", userRouter);
app.use("/thread", threadRouter);
app.use("/comment", commentRouter);
