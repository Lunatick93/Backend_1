import { Schema, model, Types } from "mongoose";

const cartSchema = new Schema(
  {
    products: [
      {
        product: { type: Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 1 }
      }
    ]
  },
  { timestamps: true }
);

export default model("Cart", cartSchema);
