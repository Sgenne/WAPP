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
import { isAuthenticated } from "../utils/auth.util";
import { handleUploadedImage } from "../utils/image.util";

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

    const user = result.user;

    if (!user) {
      res.status(result.statusCode).send({ message: result.message });
      return;
    }

    res.status(201).send({
      message: "The new user was created successfully",
      userId: user.userId,
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

    await userServices.updateUser(userId, update);

    res.status(200).send({
      message: "User information updated successfully.",
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

userRouter.put(
  "/set-visible-properties",
  isAuthenticated,
  hasVisiblePropertiesOptions,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const options = req.body.options;
    const userId = req.body.userId;

    const result = await userServices.setVisibleProperties(userId, options);

    const user = result.user;

    if (!user) {
      res.status(result.statusCode).send({ message: result.message });
      return;
    }

    res.status(200).send({
      message: "Preferences updated successfully.",
      userId: user.userId,
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

    const userResult = await userServices.getUserByUsername(username);
    const user = userResult.user;

    if (!user) {
      res.status(userResult.statusCode).send({ message: userResult.message });
      return;
    }

    const validationResult = await userServices.validatePassword(
      user.userId,
      password
    );

    if (validationResult.statusCode !== 200) {
      res
        .status(validationResult.statusCode)
        .send({ message: validationResult.message });
      return;
    }

    res
      .status(200)
      .send({ message: "The user was verified.", userId: user.userId });
  }
);

userRouter.post(
  "/upload-profile-picture",
  handleUploadedImage,
  isAuthenticated,
  async (req: Request, res: Response) => {
    // Can safely cast to Express.Multer.File as handleUploadedImage will
    // return an error message to the client if req.file is undefined.
    const image = req.file as Express.Multer.File;
    const userId: number = req.body.userId;

    const result = await userServices.updateProfilePicture(userId, {
      imageBuffer: image.buffer,
      filename: image.originalname,
    });

    res.status(result.statusCode).send({ message: result.message });
  }
);

userRouter.get("/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const result = await userServices.getUser(+userId);

  const user = result.user;

  res
    .status(result.statusCode)
    .send({ message: result.message, user: result.user });
});

userRouter.get("/username/:username", async (req: Request, res: Response) => {
  const username = req.params.username;

  const result = await userServices.getUserByUsername(username);

  res
    .status(result.statusCode)
    .send({ message: result.message, user: result.user });
});
