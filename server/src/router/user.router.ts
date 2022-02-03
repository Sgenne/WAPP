import * as userServices from "../service/user.service";
import { Request, Response, Router } from "express";

export const userRouter = Router();

userRouter.post("/register", async (req: Request, res: Response) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const birthDate = req.body.birthDate;
  if (!(email && username && password && birthDate)) {
    res.status(400).send({ message: "Invalid input" });
    return;
  }

  const newUser = await userServices.register(
    email,
    username,
    password,
    birthDate
  );
  if (!newUser) {
    res.status(500).send({ message: "Server error" });
    return;
  }
  res.status(201).send({ message: "Created user", user: newUser });
});

userRouter.post("/sign-in", async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!(username && password)) {
    res.status(400).send({ message: "Invalid input" });
    return;
  }

  const result = await userServices.signIn(username, password);

  if (result.statusCode !== 200) {
    return res.status(result.statusCode).send({ message: result.message });
  }

  res.status(200).send({ message: "Signed in successfully." });
});

userRouter.put(
  "/edit-user-information",
  async (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!(username && password)) {
      return res.status(400).send({ message: "Invalid input." });
    }

    const birthDate = req.body.birthDate;
    const bio = req.body.bio;
    const image = req.body.image;

    const partialUser = {
      username: username,
      password: password,
      birthDate: birthDate,
      bio: bio,
      image: image,
    };

    const result = await userServices.editUserInformation(partialUser);

    if (result.statusCode !== 200) {
      return res.status(result.statusCode).send({ message: result.message });
    }

    res.status(200).send({
      message: "User information updated successfully.",
      user: result.user,
    });
  }
);

userRouter.delete("/delete-user", async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!(username && password)) {
    return res.status(400).send({ message: "Invalid input." });
  }

  const result = await userServices.deleteUser(username, password);

  return res.status(result.statusCode).send({ message: result.message });
});

userRouter.get("/:username", async (req: Request, res: Response) => {
  const username = req.params.username;

  const result = await userServices.getUser(username);

  if (result.statusCode !== 200) {
    return res.status(result.statusCode).send({ message: result.message });
  }

  res.status(200).send({ message: result.message, user: result.user });
});

userRouter.put(
  "/edit-user-preferences",
  async (req: Request, res: Response) => {
    const options = req.body.options;
    const username = req.body.username;
    const password = req.body.password;
    if (
      !(
        options.email &&
        options.joinDate &&
        options.birthDate &&
        options.bio &&
        options.image &&
        options.likedThreads &&
        options.dislikedThreads &&
        username &&
        password
      )
    ) {
      return res.status(400).send({ message: "Invalid input." });
    }

    const result = await userServices.setVisibleProperties(
      username,
      password,
      options
    );

    if (result.statusCode !== 200) {
      return res.status(result.statusCode).send({ message: result.message });
    }

    res.status(200).send({
      message: "Preferences updated successfully.",
      user: result.user,
    });
  }
);
