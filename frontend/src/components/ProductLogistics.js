/* eslint-disable no-constant-binary-expression */

// Helper to check if flash sale is active
export const isFlashSaleActive = (product) => {
  if (!product || !product.flashSale || !product.flashSale.isActive)
    return false;

  const now = new Date();
  const startTime = new Date(product.flashSale.startTime);
  const endTime = new Date(product.flashSale.endTime);

  return now >= startTime && now <= endTime;
};

// Calculate effective price (flash sale priority, then regular discount)
export const calculateEffectivePrice = (product) => {
  if (!product) return 0;

  // ✅ ভ্যারিয়েন্ট প্রাইস আছে কিনা চেক করুন
  const basePrice =
    product.variantInfo?.variantPrice ||
    product.basePrice ||
    product.price ||
    0;

  // ✅ ফ্লাশ সেল অ্যাক্টিভ থাকলে
  if (isFlashSaleActive(product)) {
    const flashDiscount = product.flashSale?.discountPercentage || 0;
    return basePrice - (basePrice * flashDiscount) / 100;
  }

  // ✅ নরমাল ডিসকাউন্ট
  const discountPercent = product.discountPercentage || 0;
  if (discountPercent > 0) {
    return basePrice - (basePrice * discountPercent) / 100;
  }

  return basePrice;
};

export const calculateSavings = (product) => {
  if (!product) return 0;

  const basePrice =
    product.variantInfo?.variantPrice ||
    product.basePrice ||
    product.price ||
    0;
  const effectivePrice = calculateEffectivePrice(product);

  return basePrice - effectivePrice;
};

// Calculate variant price with flash sale support
export const calculateVariantPrice = (
  product,
  colorIndex = 0,
  sizeIndex = 0,
) => {
  if (!product?.hasVariants || !product.variants?.[colorIndex]) {
    return calculateEffectivePrice(product);
  }

  const variant = product.variants[colorIndex];
  const size = variant.sizes?.[sizeIndex];

  if (!size) return calculateEffectivePrice(product);

  const variantBasePrice = size.price;

  // Apply flash sale to variant price if active
  if (isFlashSaleActive(product)) {
    const flashDiscount = product.flashSale.discountPercentage || 0;
    return variantBasePrice - (variantBasePrice * flashDiscount) / 100;
  }

  // Apply regular discount
  const discountPercent = product?.discountPercentage || 0;
  if (discountPercent > 0) {
    return variantBasePrice - (variantBasePrice * discountPercent) / 100;
  }

  return variantBasePrice;
};

// Calculate product price considering variants and flash sale
export const calculateProductPrice = (product, qty = 1) => {
  // Check if product has variant info (from cart)
  const hasVariantInfo = product?.variantInfo?.hasVariants;

  let basePrice;
  let finalPrice;

  if (hasVariantInfo && product.variantInfo.variantPrice) {
    // Cart item with variant - apply flash sale to variant price
    basePrice = product.variantInfo.variantPrice;

    if (isFlashSaleActive(product)) {
      const flashDiscount = product.flashSale.discountPercentage || 0;
      finalPrice = basePrice - (basePrice * flashDiscount) / 100;
    } else {
      const discountPercent = product?.discountPercentage || 0;
      finalPrice = basePrice - (basePrice * discountPercent) / 100;
    }
  } else {
    // Regular product or product details page
    basePrice = product?.price || 0;
    finalPrice = calculateEffectivePrice(product);
  }

  const itemsPrice = finalPrice * qty;

  return {
    itemsPrice,
    basePrice,
    finalPrice,
    discountPercent: isFlashSaleActive(product)
      ? product.flashSale.discountPercentage || 0
      : product?.discountPercentage || 0,
    isFlashSale: isFlashSaleActive(product),
  };
};

// Get minimum price from variants with flash sale consideration
export const getMinVariantPrice = (product) => {
  if (
    !product?.hasVariants ||
    !product.variants ||
    product.variants.length === 0
  ) {
    return calculateEffectivePrice(product);
  }

  let minPrice = Infinity;
  product.variants.forEach((variant) => {
    if (variant.sizes && variant.sizes.length > 0) {
      variant.sizes.forEach((size) => {
        let price = size.price;

        // Apply flash sale if active
        if (isFlashSaleActive(product)) {
          const flashDiscount = product.flashSale.discountPercentage || 0;
          price = price - (price * flashDiscount) / 100;
        } else if (product.discountPercentage > 0) {
          price = price - (price * product.discountPercentage) / 100;
        }

        if (price < minPrice) {
          minPrice = price;
        }
      });
    }
  });

  return minPrice === Infinity ? calculateEffectivePrice(product) : minPrice;
};

// Get maximum price from variants
export const getMaxVariantPrice = (product) => {
  if (
    !product?.hasVariants ||
    !product.variants ||
    product.variants.length === 0
  ) {
    return product?.price || 0;
  }

  let maxPrice = 0;
  product.variants.forEach((variant) => {
    if (variant.sizes && variant.sizes.length > 0) {
      variant.sizes.forEach((size) => {
        let price = size.price;

        // Apply flash sale if active
        if (isFlashSaleActive(product)) {
          const flashDiscount = product.flashSale.discountPercentage || 0;
          price = price - (price * flashDiscount) / 100;
        } else if (product.discountPercentage > 0) {
          price = price - (price * product.discountPercentage) / 100;
        }

        if (price > maxPrice) {
          maxPrice = price;
        }
      });
    }
  });

  return maxPrice || product.price;
};

// Get variant colors for display
export const getVariantColors = (product, limit = 4) => {
  if (!product?.hasVariants || !product.variants) return [];
  return product.variants.slice(0, limit).map((v) => v.color);
};

// Calculate shipping with flash sale consideration (use discounted price for threshold)
export const calculateProductShipping = (product, qty, isDhaka = true) => {
  const { itemsPrice } = calculateProductPrice(product, qty);
  const itemWeight = Number(product?.weight) || 0.5;
  const totalWeight = itemWeight * qty;

  const {
    shippingType,
    insideDhakaCharge,
    outsideDhakaCharge,
    fixedShippingCharge,
    freeShippingThreshold,
    isFreeShippingActive,
  } = product?.shippingDetails || {};

  // Check free shipping threshold against discounted price
  if (
    (isFreeShippingActive && itemsPrice >= (freeShippingThreshold || 999999)) ||
    shippingType === "free"
  )
    return 0;

  if (shippingType === "fixed") return fixedShippingCharge || 0;

  if (shippingType === "weight-based") {
    let baseRate = isDhaka
      ? (insideDhakaCharge ?? 80)
      : (outsideDhakaCharge ?? 150);
    let dynamicPrice = baseRate;

    if (totalWeight > 1) {
      const extraWeight = Math.ceil(totalWeight - 1);
      dynamicPrice += extraWeight * 20;
    }
    return dynamicPrice;
  }
  return 0;
};

// Calculate cart shipping with flash sale prices
export const calculateCartShipping = (cartItems, isInsideDhaka = true) => {
  let totalWeight = 0;
  let maxFixedShipping = 0;
  let baseShippingRate = 0;
  let totalItemsPrice = 0;

  cartItems.forEach((item) => {
    const { itemsPrice } = calculateProductPrice(item, item.qty);
    totalItemsPrice += itemsPrice;
    totalWeight += (Number(item.weight) || 0.5) * item.qty;
  });

  const activeThresholds = cartItems
    .filter((i) => i.shippingDetails?.isFreeShippingActive)
    .map((i) => Number(i.shippingDetails?.freeShippingThreshold))
    .filter((t) => t > 0);

  const freeThreshold =
    activeThresholds.length > 0 ? Math.min(...activeThresholds) : Infinity;

  // Use flash sale discounted price for free shipping threshold check
  if (totalItemsPrice >= freeThreshold) return 0;

  cartItems.forEach((item) => {
    const s = item.shippingDetails || {};
    const type = s.shippingType?.toLowerCase();

    if (type === "fixed") {
      maxFixedShipping = Math.max(
        maxFixedShipping,
        Number(s.fixedShippingCharge) || 0,
      );
    } else if (type === "weight-based") {
      const rate = isInsideDhaka
        ? (Number(s.insideDhakaCharge) ?? 80)
        : (Number(s.outsideDhakaCharge) ?? 150);
      baseShippingRate = Math.max(baseShippingRate, rate);
    }
  });

  let weightBasedCharge = 0;
  if (totalWeight > 0 && baseShippingRate > 0) {
    weightBasedCharge = baseShippingRate;
    if (totalWeight > 1) {
      weightBasedCharge += Math.ceil(totalWeight - 1) * 20;
    }
  }

  return weightBasedCharge + maxFixedShipping;
};

// Get flash sale timer display
export const getFlashSaleTimeRemaining = (product) => {
  if (!isFlashSaleActive(product)) return null;

  const endTime = new Date(product.flashSale.endTime);
  const now = new Date();
  const diff = endTime - now;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes, totalMs: diff };
};

export const getCategoryPath = (cat) => {
  const path = [];
  let current = cat;
  while (current) {
    path.unshift(current);
    current = current.parent;
  }
  return path;
};
