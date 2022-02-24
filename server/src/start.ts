import cors from "cors";
import express, { Request, Response } from "express";
import path from "path";
import { commentRouter } from "./router/comment.router";
import { threadRouter } from "./router/thread.router";
import { userRouter } from "./router/user.router";
export const app = express();

app.use(cors());

app.use(express.json());

app.use("/user", userRouter);
app.use("/thread", threadRouter);
app.use("/comment", commentRouter);
app.use("/images", express.static(path.join(__dirname, "../", "images")));
