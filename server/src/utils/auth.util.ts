import { Request, Response, NextFunction } from "express";
import { validatePassword } from "../service/user.service";

/**
 * Fetches the userId and password from the request body. Validates the
 * given password. If the password is correct, then the next middleware is
 * called. Otherwise, an error response is sent.
 */
export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.body.userId;
  const password = req.body.password;

  if (!(userId && password)) {
    res.status(400).send({
      message: "Invalid input. Please provide a user-id and password.",
    });
  }

  const result = await validatePassword(userId, password);

  if (result.statusCode !== 200) {
    res.status(result.statusCode).send({ message: result.message });
    return;
  }
  next();
};
