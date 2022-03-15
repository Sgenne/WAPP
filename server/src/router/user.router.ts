import * as userServices from "../service/user.service";
import { Request, Response, Router } from "express";
import {
  handleValidationResult,
  hasPassword,
  hasUpdate,
  hasUsername,
  hasValidBirthDate,
  hasValidEmail,
  hasValidPassword,
  hasValidUsername,
} from "../middleware/validation";
import { isAuthenticated } from "../middleware/auth";
import { handleUploadedImage } from "../middleware/image";

export const userRouter = Router();

/**
 * Creates a user.
 */
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

    user
      ? res.status(201).send({
          message: "The new user was created successfully",
          user: user,
        })
      : res.status(result.statusCode).send({ message: result.message });
  }
);

/**
 * Updates a user.
 */
userRouter.put(
  "/update-user",
  isAuthenticated,
  hasUpdate,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const userId = req.body.userId;

    const update = {
      birthDate: req.body.birthDate,
      bio: req.body.bio,
      password: req.body.newPassword,
      visibleProperties: req.body.visibleProperties,
      email: req.body.email,
    };

    const result = await userServices.updateUser(userId, update);

    result.statusCode === 200
      ? res.status(200).send({
          message: "User information updated successfully.",
        })
      : res.status(res.statusCode).send({ message: result.message });
  }
);

/**
 * Deletes a user.
 */
userRouter.delete(
  "/delete-user",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const userId = req.body.userId;

    const result = await userServices.deleteUser(userId);

    return res.status(result.statusCode).send({ message: result.message });
  }
);

/**
 * Verifies that the provided password is correct for the user with the given username.
 * If verified, returns the full user object.
 */
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

    res.status(200).send({ message: "The user was verified.", user: user });
  }
);

/**
 * Updates the profile picture of the user.
 */
userRouter.post(
  "/upload-profile-picture",
  handleUploadedImage,
  isAuthenticated,
  async (req: Request, res: Response) => {
    // Can safely cast to Express.Multer.File as handleUploadedImage will
    // return an error response to the client if req.file is undefined.
    const image = req.file as Express.Multer.File;
    const userId: number = req.body.userId;

    const result = await userServices.updateProfilePicture(userId, {
      imageBuffer: image.buffer,
      filename: image.originalname,
    });

    const user = result.user;

    user
      ? res
          .status(result.statusCode)
          .send({
            message: result.message,
            profilePicture: user.profilePicture,
          })
      : res.status(result.statusCode).send({ message: result.message });
  }
);

/**
 * Returns the user object of the user with the given id.
 */
userRouter.get("/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const result = await userServices.getUser(+userId);

  const user = result.user;

  user
  ? res
      .status(result.statusCode)
      .send({
        message: result.message,
        user: user,
      })
  : res.status(result.statusCode).send({ message: result.message });
});

/**
 * Returns the user object of the user with the given username.
 */
userRouter.get("/username/:username", async (req: Request, res: Response) => {
  const username = req.params.username;

  const result = await userServices.getUserByUsername(username);

  result.user
  ? res
      .status(result.statusCode)
      .send({
        message: result.message,
        user: result.user,
      })
  : res.status(result.statusCode).send({ message: result.message });
});
