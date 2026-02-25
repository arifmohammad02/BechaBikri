import mongoose from "mongoose";
import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import sanitizeHtml from "sanitize-html";

const sanitizeDescription = (description) => {
  return sanitizeHtml(description, {
    allowedTags: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "strong",
      "em",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "br",
      "blockquote",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height", "style"],
    },
  });
};

const parseVariants = (variantsData) => {
  if (!variantsData) return [];

  try {
    const parsed =
      typeof variantsData === "string"
        ? JSON.parse(variantsData)
        : variantsData;
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error parsing variants:", error);
    return [];
  }
};

const addProduct = asyncHandler(async (req, res) => {
  try {
    const fields = req.fields;
    const {
      name,
      description,
      price,
      category,
      quantity,
      brand,
      images,
      shippingType,
      keyFeatures,
      specifications,
      hasVariants,
      variants,
      defaultColorIndex,
      defaultSizeIndex,
    } = fields;

    // ১. ভ্যালিডেশন
    if (
      !name ||
      !brand ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shippingType
    ) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    let imagesArray = [];
    if (images) {
      imagesArray = typeof images === "string" ? JSON.parse(images) : images;
      if (!Array.isArray(imagesArray)) imagesArray = [imagesArray];
    }

    if (imagesArray.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    let specsJson = specifications
      ? typeof specifications === "string"
        ? JSON.parse(specifications)
        : specifications
      : [];
    let featuresJson = keyFeatures
      ? typeof keyFeatures === "string"
        ? JSON.parse(keyFeatures)
        : keyFeatures
      : [];

    const shippingData = {
      shippingType,
      insideDhakaCharge: Number(fields.insideDhakaCharge) || 80,
      outsideDhakaCharge: Number(fields.outsideDhakaCharge) || 150,
      fixedShippingCharge: Number(fields.fixedShippingCharge) || 0,
      freeShippingThreshold: Number(fields.freeShippingThreshold) || 0,
      isFreeShippingActive:
        fields.isFreeShippingActive === "true" ||
        fields.isFreeShippingActive === true,
    };

    // Parse variants
    const hasVariantsBool = hasVariants === "true" || hasVariants === true;
    let parsedVariants = [];

    if (hasVariantsBool && variants) {
      parsedVariants = parseVariants(variants);
    }

    const product = new Product({
      ...fields,
      description: sanitizeDescription(description),
      images: imagesArray, // ডাটাবেসে [img1, img2, img3] আকারে যাবে
      image: imagesArray[0],
      specifications: specsJson,
      keyFeatures: featuresJson,
      isFeatured: fields.isFeatured === "true" || fields.isFeatured === true,
      price: Number(price),
      quantity: Number(quantity),
      countInStock: Number(fields.countInStock) || 0,
      weight: Number(fields.weight) || 0,
      shippingDetails: shippingData,
      hasVariants: hasVariantsBool,
      variants: parsedVariants,
      defaultColorIndex: Number(defaultColorIndex) || 0,
      defaultSizeIndex: Number(defaultSizeIndex) || 0,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Product Creation Error:", error);
    res.status(400).json({ error: error.message });
  }
});



const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const fields = req.fields;
    let {
      name, // নাম বাদ পড়েছিল
      description,
      price,
      category,
      quantity,
      images,
      shippingType,
      fixedShippingCharge,
      freeShippingThreshold,
      insideDhakaCharge,
      outsideDhakaCharge,
      weight,
      isFeatured,
      isFreeShippingActive,
      specifications,
      keyFeatures,
      hasVariants,
      variants,
      defaultColorIndex,
      defaultSizeIndex,
    } = fields;

    // ভ্যালিডেশন
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shippingType
    ) {
      return res
        .status(400)
        .json({ error: "Required basic fields are missing" });
    }

    if (
      fixedShippingCharge === undefined ||
      freeShippingThreshold === undefined ||
      insideDhakaCharge === undefined ||
      outsideDhakaCharge === undefined ||
      weight === undefined
    ) {
      return res
        .status(400)
        .json({ error: "Shipping configuration fields are required" });
    }

    // ইমেজের অ্যারে প্রসেসিং
    let imagesArray = [];
    if (images) {
      imagesArray = typeof images === "string" ? JSON.parse(images) : images;
      if (!Array.isArray(imagesArray)) imagesArray = [imagesArray];
    }

    const shippingData = {
      shippingType: fields.shippingType,
      insideDhakaCharge: Number(fields.insideDhakaCharge),
      outsideDhakaCharge: Number(fields.outsideDhakaCharge),
      fixedShippingCharge: Number(fields.fixedShippingCharge),
      freeShippingThreshold: Number(fields.freeShippingThreshold),
      isFreeShippingActive:
        isFreeShippingActive === "true" || isFreeShippingActive === true,
    };

    // Parse variants
    const hasVariantsBool = hasVariants === "true" || hasVariants === true;
    let parsedVariants = [];

    if (hasVariantsBool && variants) {
      parsedVariants = parseVariants(variants);
    }

    const updatedFields = {
      ...fields,
      description: sanitizeDescription(description),
      images: imagesArray,
      specifications: specifications
        ? typeof specifications === "string"
          ? JSON.parse(specifications)
          : specifications
        : [],
      keyFeatures: keyFeatures
        ? typeof keyFeatures === "string"
          ? JSON.parse(keyFeatures)
          : keyFeatures
        : [],
      isFeatured: isFeatured === "true" || isFeatured === true,
      price: Number(price),
      quantity: Number(quantity),
      weight: Number(fields.weight),
      shippingDetails: shippingData,
      hasVariants: hasVariantsBool,
      variants: parsedVariants,
      defaultColorIndex: Number(defaultColorIndex) || 0,
      defaultSizeIndex: Number(defaultSizeIndex) || 0,
    };

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true, runValidators: true },
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(400).json({ error: error.message });
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 20;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .populate("category")
      .limit(pageSize)
      .sort({ createdAt: -1 });

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: count > pageSize,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findOne({
      $or: [
        { _id: mongoose.isValidObjectId(req.params.id) ? req.params.id : null },
        { slug: req.params.id },
      ],
    }).populate({
      path: "category",
      populate: {
        path: "parent",
        populate: { path: "parent" },
      },
    });

    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Product not found" });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate({
        path: "category",
        populate: {
          path: "parent", 
          populate: {
            path: "parent",
          },
        },
      })
      .limit(50)
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findOne({
      $or: [
        { _id: mongoose.isValidObjectId(req.params.id) ? req.params.id : null },
        { slug: req.params.id },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user has already reviewed the product
    const alreadyReviewed = product.reviews.some(
      (review) => review.user.toString() === req.user._id.toString(),
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    // Create new review
    const review = {
      name: req.user.username,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    // Add the review to the product's reviews array
    product.reviews.push(review);

    // Update the number of reviews and average rating
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    // Save the updated product
    await product.save();
    res.status(201).json({ message: "Review added" });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked && checked.length > 0) {
      const getRecursiveChildIds = async (parentIds) => {
        const children = await Category.find({
          parent: { $in: parentIds },
        }).select("_id");
        if (children.length === 0) return [];
        const childIds = children.map((c) => c._id);
        const subChildIds = await getRecursiveChildIds(childIds);
        return [...childIds, ...subChildIds];
      };

      const allChildCategoryIds = await getRecursiveChildIds(checked);
      const finalCategoryIds = [...checked, ...allChildCategoryIds];

      args.category = { $in: finalCategoryIds };
    }


     if (radio && radio.length) {
       args.price = { $gte: radio[0], $lte: radio[1] };
     }

    const products = await Product.find(args).populate("category");
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});



export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
};
