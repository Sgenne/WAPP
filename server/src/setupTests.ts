import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const db = new MongoMemoryServer();

export const startTestDB = async () => {
  await db.start();
  let uri;
  try {
    uri = db.getUri();
  } catch (error) {
    return;
  }

  if (!uri) {
    throw new Error("uri not set.");
  }

  mongoose.Schema.Types.String.checkRequired((v) => v != undefined);
  await mongoose.connect(uri);
};

export const closeTestDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await db.stop();
};

export const clearTestDB = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};
