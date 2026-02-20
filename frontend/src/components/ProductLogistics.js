/* eslint-disable no-constant-binary-expression */
// UPDATE START
export const calculateProductPrice = (product, qty) => {
  const discountPercent =
    product?.discountPercentage || product?.disdiscountPercentage || 0;
  const basePrice = product?.price || 0;
  const unitPriceAfterDiscount =
    basePrice - (basePrice * discountPercent) / 100;
  const itemsPrice = unitPriceAfterDiscount * qty;
  return { itemsPrice, basePrice, discountPercent };
};

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

export const getCategoryPath = (cat) => {
  const path = [];
  let current = cat;
  while (current) {
    path.unshift(current);
    current = current.parent;
  }
  return path;
};
// UPDATE END
