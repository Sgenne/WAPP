import express, { Request, Response } from "express";
import { userRouter } from "./router/user.router";
export const app = express();
app.use(express.json());

app.use("/user", userRouter);
