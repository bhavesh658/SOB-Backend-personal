import * as cartService from "../../services/cartService.js";

// add to cart
export const addToCart = async (req, res) => {
  try {
    const cart = await cartService.addToCart(
      req.user.id,
      req.body.productId,
      req.body.quantity
    );

    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// get cart
export const getCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update
export const updateCart = async (req, res) => {
  try {
    const cart = await cartService.updateCartItem(
      req.user.id,
      req.body.productId,
      req.body.quantity
    );

    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// delete
export const removeItem = async (req, res) => {

  try {
  const cart = await cartService.removeCartItem(
    req.user.id,
    req.params.productId
  );

  res.json({
    success: true,
    cart,
    message: "Item removed from cart successfully"
  } );
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};