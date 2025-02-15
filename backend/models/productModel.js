import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

// Review Schema
const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Product Schema
const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    quantity: { type: Number, required: true },
    category: { type: ObjectId, ref: "Category", required: true },
    description: { type: String, required: true },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },

    // New features added
    discountPercentage: { type: Number, default: 0 }, // Discount Percentage
    isFeatured: { type: Boolean, default: false }, // Is Featured
    offer: { type: String, default: "" }, // Offer (e.g., discount on certain conditions)
    warranty: { type: String, default: "" }, // Warranty information (e.g., "2 years")
    // specifications: [{ type: String }], // 10 specifications or features
    discountedAmount: { type: Number, default: 0 }, // Discounted Amount
  },
  { timestamps: true }
);



// Creating Product Model
const Product = mongoose.model("Product", productSchema);

export default Product;
