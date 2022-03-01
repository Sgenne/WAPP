import { Schema, model } from "mongoose";
import { Category } from "../model/category.interface";

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
    type: Number,
    required: true,
    unique: true,
  },
});

export const categoryModel = model<Category>("Category", categorySchema);
