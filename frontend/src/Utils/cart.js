// Helper function to add decimals
export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state, shippingAddress = {}) => {
  const addr =
    shippingAddress && shippingAddress.city
      ? shippingAddress
      : state.shippingAddress || {};

  // ✅ FIXED: সঠিক itemsPrice calculation
  let totalSavings = 0;

  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => {
      // ✅ Use the already normalized finalPrice from item
      const finalPrice =
        Number(item._finalPrice) ||
        Number(item.finalPrice) ||
        Number(item.price) ||
        0;
      const qty = Number(item.qty) || 1;

      // ✅ Calculate savings from the item
      const basePrice = Number(item.basePrice) || finalPrice;
      const savingsPerItem = basePrice - finalPrice;
      totalSavings += savingsPerItem * qty;

      return acc + finalPrice * qty;
    }, 0),
  );

  const city = addr?.city?.trim().toLowerCase() || "";
  const isInsideDhaka = city.includes("dhaka");
  const itemsPriceNum = Number(state.itemsPrice);

  let finalShippingPrice = 0;

  const activeThresholds = state.cartItems
    .filter((i) => i.shippingDetails?.isFreeShippingActive === true)
    .map((i) => Number(i.shippingDetails?.freeShippingThreshold))
    .filter((t) => !isNaN(t) && t > 0);

  const freeThreshold =
    activeThresholds.length > 0 ? Math.min(...activeThresholds) : Infinity;

  // ✅ FIXED: Declare charges array before using it
  const charges = [];

  if (itemsPriceNum < freeThreshold) {
    state.cartItems.forEach((item) => {
      const s = item.shippingDetails || {};
      const type = s.shippingType?.toLowerCase();

      const qty = Number(item.qty) || 1;
      const weight = Number(item.weight) || 0.5;

      switch (type) {
        case "free": {
          charges.push(0);
          break;
        }

        case "fixed": {
          charges.push(Number(s.fixedShippingCharge) || 0);
          break;
        }

        case "inside-outside": {
          charges.push(
            isInsideDhaka
              ? Number(s.insideDhakaCharge) || 80
              : Number(s.outsideDhakaCharge) || 150,
          );
          break;
        }

        case "weight-based":
        default: {
          const totalWeight = weight * qty;
          const baseRate = isInsideDhaka ? 80 : 150;
          if (totalWeight <= 1) {
            charges.push(baseRate);
          } else {
            const extra = Math.ceil(totalWeight - 1);
            charges.push(baseRate + extra * 20);
          }
          break;
        }
      }
    });

    // ✅ FIXED: Only calculate max if charges array has items
    finalShippingPrice = charges.length > 0 ? Math.max(...charges, 0) : 0;
  }

  state.shippingPrice = addDecimals(finalShippingPrice);
  state.taxPrice = addDecimals(0);

  state.totalPrice = addDecimals(
    itemsPriceNum + Number(state.shippingPrice) + Number(state.taxPrice),
  );

  state.totalSavings = addDecimals(totalSavings);

  state.shippingPrice = addDecimals(finalShippingPrice);
  state.taxPrice = addDecimals(0);
  state.totalPrice = addDecimals(itemsPriceNum + finalShippingPrice);
  state.totalSavings = addDecimals(totalSavings);
  localStorage.setItem("cart", JSON.stringify(state));
  return state;
};
