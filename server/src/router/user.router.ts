import * as userServices from "../service/user.service";
import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";

export const userRouter = Router();

userRouter.post(
  "/register",
  body("email").isEmail(),
  body("username").isLength({ min: 4, max: 16 }),
  body("password").isLength({ min: 5, max: 16 }),
  async (req: Request, res: Response) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    // If no date is given, set birthDateParam to the current date. Just for testing
    const birthDateParam = req.body.birthDate || new Date().toISOString();
    if (validationResult(req).isEmpty()) {
      res.status(400).send({ message: "Invalid input" });
      return;
    }

    const birthDate = new Date(birthDateParam);

    const result = await userServices.register(
      email,
      username,
      password,
      birthDate
    );
    if (result.statusCode !== 201) {
      res.status(result.statusCode).send({ message: result.message });
      return;
    }
    res.status(201).send({
      message: "The new user was created successfully",
      user: result.user,
    });
  }
);

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

  res
    .status(200)
    .send({ message: "Signed in successfully.", user: result.user });
});

userRouter.put("/update-user", async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!(username && password)) {
    return res.status(400).send({ message: "Invalid input." });
  }

  const update = {
    birthDate: req.body.birthDate,
    bio: req.body.bio,
    image: req.body.image,
    password: req.body.newPassword,
  };

  const result = await userServices.updateUser(username, password, update);

  if (result.statusCode !== 200) {
    return res.status(result.statusCode).send({ message: result.message });
  }

  res.status(200).send({
    message: "User information updated successfully.",
    user: result.user,
  });
});

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
        typeof options.email !== "undefined" &&
        typeof options.joinDate !== "undefined" &&
        typeof options.birthDate !== "undefined" &&
        typeof options.bio !== "undefined" &&
        typeof options.image !== "undefined" &&
        typeof options.likedThreads !== "undefined" &&
        typeof options.dislikedThreads !== "undefined" &&
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
