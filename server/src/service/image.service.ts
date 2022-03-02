import path from "path";
import { Image } from "../model/image.interface";
import { imageFolderPath } from "../utils/image.util";
import { imageStorage } from "../imageStorage/image.storage";

export const DEFAULT_IMAGE: Image = {
  imageUrl:
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
  filename: "blank-profile-picture-973460_640.png",
  isDefault: true,
};

/**
 * The result of an image service.
 */
interface ImageServiceResult {
  /**
   * An HTTP status code describing the result of the attempted operation.
   */
  statusCode: number;

  /**
   * A message describing the result of the attempted operation.
   */
  message: string;

  /**
   * The image that the attempted service acted upon, in the case that the operation was
   * successfull.
   */
  image?: Image;
}

/**
 * Stores a given image in the file system.
 * @param image - The image to store.
 * @returns An ImageServiceResult object.
 */
export const storeImage = async (image: {
  imageBuffer: Buffer;
  filename: string;
}): Promise<ImageServiceResult> => {
  const filenamePrefix: number = new Date().getTime();
  const newName: string = filenamePrefix + image.filename;
  let storedImage: Image;

  try {
    storedImage = await imageStorage.storeImage(image.imageBuffer, newName);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "The image could not be stored.";
    return { statusCode: 500, message: message };
  }

  return {
    statusCode: 201,
    message: "The image was stored successfully.",
    image: storedImage,
  };
};

export const deleteImage = async (
  image: Image
): Promise<ImageServiceResult> => {
  try {
    await imageStorage.deleteImage(image);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "The image could not be stored.";
    return { statusCode: 500, message: message };
  }

  return {
    statusCode: 200,
    message: "The image was deleted successfully.",
  };
};

/**
 * Returns the path to an image in the file system with a given filename.
 * @param filename - The name of the image.
 */
const getImagePath = (filename: string) => path.join(imageFolderPath, filename);
