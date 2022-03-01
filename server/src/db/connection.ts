import mongoose from "mongoose";
import { DB_URI } from "../../environmentVariables";

// To allow empty string but not undefined in all schemas.
mongoose.Schema.Types.String.checkRequired((v) => v != undefined);

export const connectToDb = (): Promise<void> =>
  new Promise(async (resolve) => {
    await mongoose.connect(DB_URI);
    resolve();
  });
