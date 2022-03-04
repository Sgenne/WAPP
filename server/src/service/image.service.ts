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
 * The result of an image service. Contains a status code and message describing the
 * result of the attempted service. If the service was successful, then the result
 * will contain the image that was acted upon.
 */
interface ImageServiceResult {
  statusCode: number;
  message: string;
  image?: Image;
}

/**
 * Adds an image to persistant storage.
 *
 * @param image - The image to store.
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

/**
 * Removes an image from persistant storage.
 *
 * @param image - The image to delete.
 */
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