import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

/**
 * Handles the result of a request validation. If the
 * request was not valid, then a response will be sent
 * with status code 400 and the error message. Otherwise,
 * the next middleware will be called.
 */
export const handleValidationResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessage = errors.array()[0];
    res.status(400).send({ message: errorMessage });
    return;
  }
  next();
};

/**
 * Verifies that the request body has a valid username.
 */
export const hasValidUsername = body("username")
  .exists()
  .withMessage("No username was provided.")
  .isLength({ min: 4, max: 16 })
  .isAlphanumeric()
  .withMessage("The given username was invalid.");

/**
 * Verifies that the request body has a valid password.
 */
export const hasValidPassword = body("password")
  .exists()
  .withMessage("No password was provided")
  .custom((value) => !/\s/.test(value))
  .withMessage("No whitespace is allowed in the password.")
  .isLength({ min: 5, max: 16 })
  .withMessage("The given password was invalid.");

/**
 * Verifies that the request body has a valid email.
 */
export const hasValidEmail = body("email")
  .exists()
  .withMessage("No email was provided.")
  .isEmail()
  .withMessage("The given email was invalid.");

/**
 * Verifies that the request body has a valid birth date.
 * A valid birthdate has format ISO 8601.
 * @example 1995-12-17T03:24:00
 */
export const hasValidBirthDate = body("birthDate")
  .exists()
  .withMessage("No birth date was provided.")
  .isISO8601()
  .withMessage("The given birth date was invalid.");

/**
 * Verifies that the request body has a username.
 */
export const hasUsername = body("username")
  .notEmpty()
  .withMessage("No username was provided.");

/**
 * Verifies that the request body has a password.
 */
export const hasPassword = body("password")
  .notEmpty()
  .withMessage("No password was provided");

/**
 * Verifies that the request body has a valid options object with boolean properties.
 */
export const hasVisiblePropertiesOptions = body("options")
  .isObject()
  .withMessage("No options object was provided.")
  .custom((options) => {
    if (
      !(
        typeof options.email === "boolean" &&
        typeof options.joinDate === "boolean" &&
        typeof options.birthDate === "boolean" &&
        typeof options.bio === "boolean" &&
        typeof options.image === "boolean" &&
        typeof options.likedThreads === "boolean" &&
        typeof options.dislikedThreads === "boolean"
      )
    ) {
      throw new Error("The given options object was invalid.");
    }
    return true;
  });
