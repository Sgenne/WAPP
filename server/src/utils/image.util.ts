import { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";

/**
 * The path to the folder used to store images.
 */
export const imageFolderPath = path.join(__dirname, "../../images");

export const handleUploadedImage = [
  multer().single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    const uploadedFile = req.file;

    if (!uploadedFile) {
      res.status(400).send({ message: "No image was provided." });
      return;
    }

    if (
      !(
        uploadedFile.mimetype === "image/jpg" ||
        uploadedFile.mimetype === "image/jpeg"
      )
    ) {
      res.status(400).send({ message: "Invalid image format." });
      return;
    }

    next();

  },
];