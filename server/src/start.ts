import express, { Request, Response } from "express";

export const app = express();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello" });
});

app.use(express.json());
