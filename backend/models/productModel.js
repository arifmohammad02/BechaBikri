import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
import slugify from "slugify";

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
    slug: { type: String, unique: true, lowercase: true },
    images: [{ type: String, required: true }],
    brand: { type: String, required: true },
    quantity: { type: Number, required: true },
    category: { type: ObjectId, ref: "Category", required: true },
    description: { type: String, required: true },
    keyFeatures: [{ type: String }],
    specifications: [
      {
        label: String,
        value: String,
      },
    ],
    descriptionImages: [{ type: String }],
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    discountPercentage: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    offer: { type: String, default: "" },
    warranty: { type: String, default: "" },
    discountedAmount: { type: Number, default: 0 },
    weight: { type: Number, default: 0.5 },
    shippingDetails: {
      shippingType: {
        type: String,
        enum: ["weight-based", "fixed", "free"],
        default: "weight-based",
      },
      fixedShippingCharge: { type: Number, default: 0 },
      freeShippingThreshold: { type: Number, default: 99999 },
      insideDhakaCharge: { type: Number, default: 80 },
      outsideDhakaCharge: { type: Number, default: 150 },
      isFreeShippingActive: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});



// Creating Product Model
const Product = mongoose.model("Product", productSchema);

export default Product;
