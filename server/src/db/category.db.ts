import { Schema } from "mongoose";
import { Category } from "../model/category.interface";
import { db } from "./connection";

const categorySchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
    unique: true,
  },
});

export const categoryModel = db.model<Category>("Category", categorySchema);
