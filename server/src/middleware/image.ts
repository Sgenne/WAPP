import { NextFunction, Request, Response } from "express";
import multer from "multer";

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
        uploadedFile.mimetype === "image/jpeg" ||
        uploadedFile.mimetype === "image/png"
      )
    ) {
      res.status(400).send({ message: "Invalid image format." });
      return;
    }

    next();
  },
];
