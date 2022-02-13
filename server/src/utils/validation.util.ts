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
 * A username is valid if it has between 4 and 16 alphanumeric
 * characters. Usernames cannot have whitespace.
 */
export const hasValidUsername = body("username")
  .exists()
  .withMessage("No username was provided.")
  .isLength({ min: 4, max: 16 })
  .isAlphanumeric()
  .withMessage("The given username was invalid.");

/**
 * Verifies that the request body has a valid password.
 * A username is valid if it has between 5 and 16, non whitespace,
 * characters.
 */
export const hasValidPassword = body("password")
  .exists()
  .withMessage("No password was provided")
  .custom((value) => !/\s/.test(value))
  .withMessage("No whitespace is allowed in the password.")
  .isLength({ min: 5, max: 42 })
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

/**
 * Verifies that the request body has a valid thread-id.
 * Thread-ids have to be numeric.
 */
export const hasValidThreadId = body("threadId")
  .notEmpty()
  .withMessage("No thread-id was provided.")
  .isNumeric()
  .withMessage("The thread-id was invalid.");

/**
 * Verifies that the request body has a non-empty content field.
 */
export const hasContent = body("content")
  .notEmpty()
  .withMessage("No content was provided");

/**
 * Verifies that the request body has a valid thread title.
 * A thread title is valid if it is between 4 and 16 characters.
 */
export const hasValidThreadTitle = body("title")
  .notEmpty()
  .withMessage("No thread title was provided.")
  .isLength({ min: 4, max: 64 })
  .withMessage("The title has to be between 4 and 16 characters long.");

/**
 * Verifies that the request body has a non-empty category field.
 */
export const hasCategory = body("category")
  .notEmpty()
  .withMessage("No category was provided.");

/**
 * Verifies that the request body has a valid comment-id.
 * A valid comment-id has to be numeric.
 */
export const hasValidCommentId = body("commentId")
  .notEmpty()
  .withMessage("No comment-id was provided.")
  .isNumeric()
  .withMessage("The comment-id was invalid.");

/**
 * Verifies that the request body has a valid user-id.
 */
export const hasValidUserId = body("userId")
  .notEmpty()
  .withMessage("No user-id was provided.");
