import mongoose, { model, models, Schema } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true },
  parent: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  properties: [
    {
      name: String,
      values: [String],
    },
  ],
});

export const Category =
  mongoose.models?.Category || mongoose.model("Category", CategorySchema);
