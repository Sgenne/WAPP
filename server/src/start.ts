import cors from "cors";
import express from "express";
import { handle404 } from "./errorHandling";
import { commentRouter } from "./router/comment.router";
import { threadRouter } from "./router/thread.router";
import { userRouter } from "./router/user.router";
export const app = express();

app.use(cors());

app.use(express.json());

app.use("/user", userRouter);
app.use("/thread", threadRouter);
app.use("/comment", commentRouter);

app.use(handle404);
