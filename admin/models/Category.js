import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true },
  parent: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
    default: null,
  },
});

export const Category =
  mongoose.models?.Category || mongoose.model("Category", CategorySchema);
