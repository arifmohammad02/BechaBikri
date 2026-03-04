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

const parseFlashSale = (flashSaleData) => {
  if (!flashSaleData) return { isActive: false, discountPercentage: 0 };

  try {
    const parsed =
      typeof flashSaleData === "string"
        ? JSON.parse(flashSaleData)
        : flashSaleData;
    return {
      isActive: parsed.isActive === true || parsed.isActive === "true",
      discountPercentage: Number(parsed.discountPercentage) || 0,
      startTime: parsed.startTime ? new Date(parsed.startTime) : null,
      endTime: parsed.endTime ? new Date(parsed.endTime) : null,
      flashSalePrice: Number(parsed.flashSalePrice) || 0,
    };
  } catch (error) {
    console.error("Error parsing flash sale:", error);
    return { isActive: false, discountPercentage: 0 };
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
      flashSale,
      salesCount,
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

    // Parse flash sale
    const parsedFlashSale = parseFlashSale(flashSale);

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const product = new Product({
      ...fields,
      slug,
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
      flashSale: parsedFlashSale,
      salesCount: Number(salesCount) || 0,
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
      name, 
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
      flashSale,
      salesCount,
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

    // Parse flash sale
    const parsedFlashSale = parseFlashSale(flashSale);
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const updatedFields = {
      ...fields,
      slug,
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
      flashSale: parsedFlashSale,
      salesCount: Number(fields.salesCount) || 0,
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

// productController.js
const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 16; // Match frontend itemsPerPage
    const page = Number(req.query.page) || 1;

    // Build query object
    let query = { isActive: { $ne: false } };
    let sortOption = { createdAt: -1 };

    // 🔍 Keyword search
    if (req.query.keyword) {
      query.$or = [
        { name: { $regex: req.query.keyword, $options: "i" } },
        { brand: { $regex: req.query.keyword, $options: "i" } },
        { description: { $regex: req.query.keyword, $options: "i" } }
      ];
    }

    // 🏷️ Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // 💰 Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // 📊 Sorting
    if (req.query.sort) {
      switch (req.query.sort) {
        case "price-low":
          sortOption = { price: 1 };
          break;
        case "price-high":
          sortOption = { price: -1 };
          break;
        case "bestselling":
          sortOption = { salesCount: -1, rating: -1 };
          break;
        case "rating":
          sortOption = { rating: -1 };
          break;
        case "name":
          sortOption = { name: 1 };
          break;
        case "newest":
        default:
          sortOption = { createdAt: -1 };
      }
    }

    // Execute queries
    const count = await Product.countDocuments(query);
    
    const products = await Product.find(query)
      .populate("category", "name")
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
      hasMore: count > pageSize * page,
      sort: req.query.sort || 'newest'
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
       return res.json(product.toObject());
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

const fetchNewArrivals = asyncHandler(async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;
    const products = await Product.find({})
      .populate("category")
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// 🆕 Best Sellers - Get products with highest sales count
const fetchBestSellers = asyncHandler(async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;
    const products = await Product.find({})
      .populate("category")
      .sort({ salesCount: -1, rating: -1 })
      .limit(limit);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});
// 🆕 Flash Sale - Get products with active flash sale
const fetchFlashSaleProducts = asyncHandler(async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;
    const now = new Date();

    const products = await Product.find({
      "flashSale.isActive": true,
      "flashSale.startTime": { $lte: now },
      "flashSale.endTime": { $gte: now },
    })
      .populate("category")
      .limit(limit);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// 🆕 Update sales count (to be called when order is placed)
const updateProductSalesCount = asyncHandler(async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    product.salesCount = (product.salesCount || 0) + (quantity || 1);
    await product.save();

    res.json({
      message: "Sales count updated",
      salesCount: product.salesCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
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

// productController.js - Updated fetchRelatedProducts

// @desc    Get related products based on category and brand
// @route   GET /api/products/related/:id
// @access  Public
const fetchRelatedProducts = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;
    const limit = Number(req.query.limit) || 5;

    // 🆕 Find product by ID or Slug (same logic as fetchProductById)
    const currentProduct = await Product.findOne({
      $or: [
        { _id: mongoose.isValidObjectId(productId) ? productId : null },
        { slug: productId },
      ],
    });
    
    if (!currentProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const { category, brand, _id: actualProductId } = currentProduct;

    // Build query to find related products
    let relatedProducts = [];

    // Step 1: Find products with same category (excluding current product)
    if (category) {
      const sameCategory = await Product.find({
        _id: { $ne: actualProductId }, // Use actual ObjectId here
        category: category,
        isActive: { $ne: false }
      })
      .populate("category", "name")
      .limit(limit)
      .select("name price images brand slug discountPercentage flashSale rating");

      relatedProducts = [...sameCategory];
    }

    // Step 2: If not enough, add same brand products
    if (relatedProducts.length < limit && brand) {
      const existingIds = relatedProducts.map(p => p._id.toString());
      existingIds.push(actualProductId.toString());

      const sameBrand = await Product.find({
        _id: { $nin: existingIds },
        brand: brand,
        isActive: { $ne: false }
      })
      .populate("category", "name")
      .limit(limit - relatedProducts.length)
      .select("name price images brand slug discountPercentage flashSale rating");

      relatedProducts = [...relatedProducts, ...sameBrand];
    }

    // Step 3: If still not enough, add random products
    if (relatedProducts.length < limit) {
      const existingIds = relatedProducts.map(p => p._id.toString());
      existingIds.push(actualProductId.toString());

      const randomProducts = await Product.find({
        _id: { $nin: existingIds },
        isActive: { $ne: false }
      })
      .populate("category", "name")
      .limit(limit - relatedProducts.length)
      .select("name price images brand slug discountPercentage flashSale rating");

      relatedProducts = [...relatedProducts, ...randomProducts];
    }

    res.json(relatedProducts);
    
  } catch (error) {
    console.error("Error fetching related products:", error);
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
  fetchNewArrivals,
  fetchBestSellers,
  fetchFlashSaleProducts,
  updateProductSalesCount,
  filterProducts,
  fetchRelatedProducts,
};
