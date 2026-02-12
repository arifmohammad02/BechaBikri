export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state, shippingAddress = {}) => {
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => {
      const discountPercent =
        item.discountPercentage || item.disdiscountPercentage || 0;
      const discount = (item.price * discountPercent) / 100;
      const priceAfterDiscount = item.price - discount;
      return acc + priceAfterDiscount * item.qty;
    }, 0),
  );

  let totalWeight = 0;
  let maxFixedShipping = 0; 
  let baseShippingRate = 0;

  const isInsideDhaka = shippingAddress?.city
    ?.trim()
    .toLowerCase()
    .includes("dhaka");

  const freeThreshold =
    state.cartItems.length > 0
      ? Math.max(
          ...state.cartItems.map((i) => {
            const s = i.shippingDetails || {};
            return s.isFreeShippingActive
              ? Number(s.freeShippingThreshold) || 999999
              : 999999;
          }),
        )
      : 999999;


  let finalShippingPrice = 0;

 if (Number(state.itemsPrice) < freeThreshold) {
   state.cartItems.forEach((item) => {
     const s = item.shippingDetails || {};

     if (s.shippingType === "fixed") {
       const currentFixed = Number(s.fixedShippingCharge) || 0;
       if (currentFixed > maxFixedShipping) {
         maxFixedShipping = currentFixed;
       }
     } else if (s.shippingType === "weight-based") {
       totalWeight += (Number(item.weight) || 0.5) * item.qty;
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

  state.shippingPrice = addDecimals(finalShippingPrice);
  state.taxPrice = addDecimals(Number(0.0 * state.itemsPrice));


  state.totalPrice = addDecimals(
    Number(state.itemsPrice) +
      Number(state.shippingPrice) +
      Number(state.taxPrice),
  );

  localStorage.setItem("cart", JSON.stringify(state));
  return state;
};
