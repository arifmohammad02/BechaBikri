export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state, shippingAddress = {}) => {

  // Calculate the items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Calculate the shipping price
  state.shippingPrice = addDecimals(
    shippingAddress?.shippingCharge ?? 0  // Ensure fallback if undefined
  );

  // Calculate the tax price
  state.taxPrice = addDecimals(Number((0.0 * state.itemsPrice).toFixed(2)));

  // Calculate the total price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  // Save the cart to localStorage
  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
