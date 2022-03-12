import mongoose from "mongoose";
import "dotenv/config";

// To allow empty string but not undefined in all schemas.
mongoose.Schema.Types.String.checkRequired((v) => v != undefined);

export const connectToDb = (): Promise<void> =>
  new Promise(async (resolve) => {
    mongoose.connect(<string>process.env.DB_URI_Test);
    resolve();
  });
