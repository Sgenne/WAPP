import * as userServices from "../service/user.service";
import { Request, Response, Router } from "express";

export const userRouter = Router();

userRouter.post("/register", async (req: Request, res: Response) => {
  const email = req.body.email;
  const userName = req.body.userName;
  const password = req.body.password;
  const birthDate = req.body.birthDate;
  if (!(email && userName && password && birthDate)) {
    res.status(400).send({ message: "Invalid input" });
    return;
  }

  const newUser = await userServices.register(
    email,
    userName,
    password,
    birthDate
  );
  if (!newUser) {
    res.status(500).send({ message: "Server error" });
    return;
  }
  res.status(201).send({ message: "Created user", user: newUser });
});
