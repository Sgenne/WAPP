import * as userServices from "../service/user.service";
import { Request, Response, Router } from "express";
import {
  handleValidationResult,
  hasPassword,
  hasUsername,
  hasValidBirthDate,
  hasValidEmail,
  hasValidPassword,
  hasValidUsername,
  hasVisiblePropertiesOptions,
} from "../utils/validation.util";

export const userRouter = Router();

userRouter.post(
  "/register",
  hasValidEmail,
  hasValidUsername,
  hasValidPassword,
  hasValidBirthDate,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const birthDateParam = req.body.birthDate;

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

userRouter.post(
  "/sign-in",
  hasUsername,
  hasPassword,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;

    const result = await userServices.signIn(username, password);

    if (result.statusCode !== 200) {
      return res.status(result.statusCode).send({ message: result.message });
    }

    res
      .status(200)
      .send({ message: "Signed in successfully.", user: result.user });
  }
);

userRouter.put(
  "/update-user",
  hasUsername,
  hasPassword,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;

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
  }
);

userRouter.delete(
  "/delete-user",
  hasUsername,
  hasPassword,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;

    const result = await userServices.deleteUser(username, password);

    return res.status(result.statusCode).send({ message: result.message });
  }
);

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
  hasUsername,
  hasPassword,
  hasVisiblePropertiesOptions,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const options = req.body.options;
    const username = req.body.username;
    const password = req.body.password;

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
