import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// 🔹 Validate Cart
const validateCart = (cart) => {
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }
};

// 🔹 Validate Address
const validateAddress = (address) => {
  if (!address) {
    throw new Error("Address required");
  }
};

// 🔹 Validate Products
const validateProducts = async (items) => {
  for (let item of items) {
    const product = await Product.findById(item.product._id);

    if (!product) throw new Error("Product removed");

    if (product.price !== item.price) {
      throw new Error("Price changed, please refresh cart");
    }

    if (item.quantity > product.stock) {
      throw new Error("Stock not available");
    }
  }
};

// 🔹 Create Order Data
const buildOrderData = (userId, cart, address, paymentMethod) => ({
  userId,
  products: cart.items.map(item => ({
    productId: item.product._id,
    quantity: item.quantity,
    price: item.price
  })),
  address,
  paymentMethod,
  subtotal: cart.subtotal,
  tax: cart.tax,
  totalAmount: cart.total
});

// 🔹 Stock value
const getStockValue = (quantity, type) => {
  if (type === "decrease") return -quantity;
  return quantity;
};

// 🔹 Update Stock
const updateStock = async (items, type = "decrease") => {
  for (let item of items) {
    const productId = item.product?._id || item.productId;
    const value = getStockValue(item.quantity, type);

    await Product.findByIdAndUpdate(productId, {
      $inc: { stock: value }
    });
  }
};

// 🔹 Clear Cart
const clearCart = async (cart) => {
  cart.items = [];
  cart.subtotal = 0;
  cart.tax = 0;
  cart.total = 0;
  await cart.save();
};

// 🔹 Create Order
export const createOrder = async (userId, address, paymentMethod) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  validateCart(cart);
  validateAddress(address);

  await validateProducts(cart.items);

  const orderData = buildOrderData(userId, cart, address, paymentMethod);

  const order = await Order.create(orderData);

  await updateStock(cart.items, "decrease");

  await clearCart(cart);

  return order;
};

// 🔹 Get Orders
export const getUserOrders = async (userId) => {
  return Order.find({ userId })
    .sort({ createdAt: -1 })
    .populate("products.productId", "name price images");
};

// 🔹 Get Order by ID
export const getOrderById = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, userId })
    .populate("products.productId");

  if (!order) throw new Error("Order not found");

  return order;
};

// 🔹 Validate Cancel
const validateCancel = (order) => {
  if (!order) throw new Error("Order not found");

  if (order.status === "cancelled") {
    throw new Error("Order already cancelled");
  }

  if (["shipped", "delivered"].includes(order.status)) {
    throw new Error("Order cannot be cancelled after shipping");
  }
};

// 🔹 Cancel Order
export const cancelOrder = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, userId });

  validateCancel(order);

  order.status = "cancelled";

  await updateStock(order.products, "increase");

  await order.save();

  return order;
};