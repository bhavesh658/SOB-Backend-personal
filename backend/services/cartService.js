import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const calculateCart = (items) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return { subtotal, tax, total };
};

export const addToCart = async (userId, productId, qty) => {
  const product = await Product.findById(productId);

  if (!product) throw new Error("Product not found");

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += qty;
  } else {
    cart.items.push({
      product: productId,
      quantity: qty,
      price: product.price
    });
  }

  if (qty > product.stock) {
    throw new Error("Quantity exceeds stock");
  }

  const totals = calculateCart(cart.items);

  cart.subtotal = totals.subtotal;
  cart.tax = totals.tax;
  cart.total = totals.total;

  await cart.save();

  return cart;
};

export const getCart = async (userId) => {
  return await Cart.findOne({ user: userId }).populate("items.product");
};

export const updateCartItem = async (userId, productId, qty) => {
  const cart = await Cart.findOne({ user: userId });

  const item = cart.items.find(
    (i) => i.product.toString() === productId
  );

  if (!item) throw new Error("Item not found");

  item.quantity = qty;

  const totals = calculateCart(cart.items);

  cart.subtotal = totals.subtotal;
  cart.tax = totals.tax;
  cart.total = totals.total;

  await cart.save();

  return cart;
};

export const    removeCartItem = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });

  cart.items = cart.items.filter(
    (i) => i.product.toString() !== productId
  );

  const totals = calculateCart(cart.items);

  cart.subtotal = totals.subtotal;
  cart.tax = totals.tax;
  cart.total = totals.total;

  await cart.save();

  return cart;
};