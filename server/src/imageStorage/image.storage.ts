import { Bucket, Storage } from "@google-cloud/storage";
import { Image } from "../model/image.interface";

const BUCKET_NAME = "wapp-images";
const KEY_FILE_NAME = "google-cloud-key.json";

class ImageStorage {
  private bucket: Bucket;

  constructor() {
    this.bucket = new Storage({ keyFilename: KEY_FILE_NAME }).bucket(
      BUCKET_NAME
    );
  }

  /**
   * Adds an image to persistant storage.
   *
   * @param image - Buffer object containing the image being uploaded.
   *
   * @param filename - The name of the image.
   *
   * @returns - The stored image.
   */
  storeImage = (image: Buffer, filename: string): Promise<Image> =>
    new Promise<Image>((resolve, reject) => {
      const storedObject = this.bucket.file(filename);

      storedObject
        .createWriteStream()
        .on("error", (error) => {
          reject(error);
        })
        .on("finish", () => {
          resolve({
            imageUrl: storedObject.publicUrl(),
            filename: filename,
          });
        })
        .end(image);
    });

  /**
   * Deletes an image from persistant storage.
   *
   * @param image - The image to be deleted.
   */
  deleteImage = async (image: Image): Promise<void> => {
    await this.bucket.file(image.filename).delete();
  };
}

/**
 * Handles persistant storage of images.
 */
export const imageStorage = new ImageStorage();
