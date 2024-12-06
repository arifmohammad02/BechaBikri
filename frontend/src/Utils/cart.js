export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  // Ensure cartItems is an array
  const cartItems = Array.isArray(state.cartItems) ? state.cartItems : [];

  // Calculate the items price
  state.itemsPrice = addDecimals(
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Calculate the total shipping charge
  state.shippingPrice = addDecimals(
    cartItems.reduce((acc, item) => acc + (item.shippingCharge || 0), 0)
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

