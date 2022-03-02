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

  storeImage = (file: Buffer, filename: string): Promise<Image> =>
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
        .end(file);
    });

  deleteImage = async (image: Image): Promise<void> => {
    await this.bucket.file(image.filename).delete();
  };
}

export const imageStorage = new ImageStorage();
