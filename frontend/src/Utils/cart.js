export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state, shippingAddress = {}) => {
  // ১. আইটেম প্রাইস ক্যালকুলেশন (ডিসকাউন্ট সহ)
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => {
      const discountPercent = Number(
        item.discountPercentage || item.disdiscountPercentage || 0,
      );
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 1;

      const discount = (price * discountPercent) / 100;
      const priceAfterDiscount = price - discount;
      return acc + priceAfterDiscount * qty;
    }, 0),
  );

  let totalWeight = 0;
  let maxFixedShipping = 0;
  let baseShippingRate = 0;

  // ২. ঢাকা সিটি চেক
  const city = shippingAddress?.city?.trim().toLowerCase() || "";
  const isInsideDhaka = city.includes("dhaka");

  // ৩. ফ্রি শিপিং থ্রেশহোল্ড বের করা
  const activeThresholds = state.cartItems
    .filter((i) => i.shippingDetails?.isFreeShippingActive === true)
    .map((i) => Number(i.shippingDetails?.freeShippingThreshold))
    .filter((t) => !isNaN(t) && t > 0);

  const freeThreshold =
    activeThresholds.length > 0 ? Math.min(...activeThresholds) : Infinity;

  let finalShippingPrice = 0;

  // ৪. শিপিং চার্জ ক্যালকুলেশন
  if (Number(state.itemsPrice) < freeThreshold) {
    state.cartItems.forEach((item) => {
      const s = item.shippingDetails || {};
      const type = s.shippingType?.toLowerCase();

      if (type === "fixed") {
        const currentFixed = Number(s.fixedShippingCharge) || 0;
        if (currentFixed > maxFixedShipping) {
          maxFixedShipping = currentFixed;
        }
      } else if (type === "weight-based") {
        const weight = Number(item.weight) || 0.5;
        const qty = Number(item.qty) || 1;
        totalWeight += weight * qty;

        const rate = isInsideDhaka
          ? Number(s.insideDhakaCharge) || 80
          : Number(s.outsideDhakaCharge) || 150;

        if (rate > baseShippingRate) {
          baseShippingRate = rate;
        }
      }
    });

    let weightBasedCharge = 0;
    if (totalWeight > 0) {
      weightBasedCharge = baseShippingRate;
      if (totalWeight > 1) {
        weightBasedCharge += Math.ceil(totalWeight - 1) * 20;
      }
    }

    finalShippingPrice = weightBasedCharge + maxFixedShipping;
  } else {
    finalShippingPrice = 0;
  }

  // ৫. ফাইনাল স্টেট আপডেট
  state.shippingPrice = addDecimals(finalShippingPrice);
  state.taxPrice = addDecimals(Number(0.0 * Number(state.itemsPrice)));

  state.totalPrice = addDecimals(
    Number(state.itemsPrice) +
      Number(state.shippingPrice) +
      Number(state.taxPrice),
  );

  localStorage.setItem("cart", JSON.stringify(state));
  return state;
};
