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
  { timestamps: true },
);

// Variant Schema - For Color/Size combinations
const variantSchema = mongoose.Schema({
  color: {
    name: { type: String, required: true }, // e.g., "Red", "Blue"
    hexCode: { type: String, default: "" }, // e.g., "#FF0000"
    image: { type: String, required: true }, // Main image for this color
    images: [{ type: String }], // Additional images for this color
  },
  sizes: [
    {
      size: { type: String, required: true }, // e.g., "S", "M", "L", "XL"
      price: { type: Number, required: true }, // Variant specific price
      countInStock: { type: Number, required: true, default: 0 },
      sku: { type: String, default: "" }, // Optional SKU for this variant
      isAvailable: { type: Boolean, default: true },
    },
  ],
  isActive: { type: Boolean, default: true },
});

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

    hasVariants: { type: Boolean, default: false },
    variants: [variantSchema],

    // Default variant selection (for display purposes)
    defaultColorIndex: { type: Number, default: 0 },
    defaultSizeIndex: { type: Number, default: 0 },

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

  // Auto-calculate total stock from variants if hasVariants is true
  if (this.hasVariants && this.variants && this.variants.length > 0) {
    let totalStock = 0;
    this.variants.forEach((variant) => {
      if (variant.sizes && variant.sizes.length > 0) {
        variant.sizes.forEach((size) => {
          totalStock += size.countInStock || 0;
        });
      }
    });
    this.countInStock = totalStock;
  }

  next();
});

// Method to get price for specific variant
productSchema.methods.getVariantPrice = function (colorIndex, sizeIndex) {
  if (!this.hasVariants || !this.variants[colorIndex]) {
    return this.price;
  }
  const variant = this.variants[colorIndex];
  if (!variant.sizes || !variant.sizes[sizeIndex]) {
    return this.price;
  }
  return variant.sizes[sizeIndex].price;
};

// Method to check stock for specific variant
productSchema.methods.getVariantStock = function (colorIndex, sizeIndex) {
  if (!this.hasVariants || !this.variants[colorIndex]) {
    return this.countInStock;
  }
  const variant = this.variants[colorIndex];
  if (!variant.sizes || !variant.sizes[sizeIndex]) {
    return 0;
  }
  return variant.sizes[sizeIndex].countInStock;
};

// Method to get images for specific color
productSchema.methods.getColorImages = function (colorIndex) {
  if (!this.hasVariants || !this.variants[colorIndex]) {
    return this.images;
  }
  const variant = this.variants[colorIndex];
  return variant.color.images && variant.color.images.length > 0
    ? variant.color.images
    : [variant.color.image];
};

// Creating Product Model
const Product = mongoose.model("Product", productSchema);

export default Product;
