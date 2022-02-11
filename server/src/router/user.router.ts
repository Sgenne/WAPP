import * as userServices from "../service/user.service";
import { Request, Response, Router } from "express";
import {
  handleValidationResult,
  hasPassword,
  hasValidBirthDate,
  hasValidEmail,
  hasValidPassword,
  hasValidUserId,
  hasValidUsername,
  hasVisiblePropertiesOptions,
} from "../utils/validation.util";
import { isAuthenticated } from "../utils/auth.util";

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

userRouter.put(
  "/update-user",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const userId = req.body.userId;

    const update = {
      birthDate: req.body.birthDate,
      bio: req.body.bio,
      image: req.body.image,
      password: req.body.newPassword,
    };

    const result = await userServices.updateUser(userId, update);

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
  isAuthenticated,
  async (req: Request, res: Response) => {
    const userId = req.body.userId;

    const result = await userServices.deleteUser(userId);

    return res.status(result.statusCode).send({ message: result.message });
  }
);

userRouter.get("/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const result = await userServices.getUser(+userId);

  if (result.statusCode !== 200) {
    return res.status(result.statusCode).send({ message: result.message });
  }

  res.status(200).send({ message: result.message, user: result.user });
});

userRouter.put(
  "/edit-user-preferences",
  isAuthenticated,
  hasVisiblePropertiesOptions,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const options = req.body.options;
    const userId = req.body.username;

    const result = await userServices.setVisibleProperties(userId, options);

    if (result.statusCode !== 200) {
      return res.status(result.statusCode).send({ message: result.message });
    }

    res.status(200).send({
      message: "Preferences updated successfully.",
      user: result.user,
    });
  }
);

userRouter.post(
  "/validate-password",
  hasValidUserId,
  hasPassword,
  async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const password = req.body.password;

    const result = await userServices.validatePassword(userId, password);

    res.status(result.statusCode).send({ message: result.message, user: result.user });
  }
);
