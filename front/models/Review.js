import mongoose, { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

if (process.env.NODE_ENV === "development") {
  if (mongoose.connection.readyState === 1) {
    mongoose.connection.dropCollection("reviews").catch(() => {
      console.log("Kolekcja reviews nie istnieje lub nie może być usunięta");
    });
  }
}

export const Review = models?.Review || model("Review", ReviewSchema);
