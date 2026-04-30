import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (userId, address, paymentMethod) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  if (!address) {
    throw new Error("Address required");
  }

  for (let item of cart.items) {
    const product = await Product.findById(item.product._id);

    if (!product) throw new Error("Product removed");

    if (product.price !== item.price) {
      throw new Error("Price changed, please refresh cart");
    }

    if (item.quantity > product.stock) {
      throw new Error("Stock not available");
    }
  }

  const order = await Order.create({
    userId: userId,

    products: cart.items.map(item => ({
      productId: item.product._id,
      quantity: item.quantity,
      price: item.price
    })),

    address: address,

    paymentMethod: paymentMethod,

    subtotal: cart.subtotal,
    tax: cart.tax,

    totalAmount: cart.total
  });

  for (let item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity }
    });
  }


  cart.items = [];
  cart.subtotal = 0;
  cart.tax = 0;
  cart.total = 0;

  await cart.save();

  return order;
};


export const getUserOrders = async (userId) => {
  return await Order.find({ userId })
    .sort({ createdAt: -1 })
    .populate("products.productId", "name price images");
};


export const getOrderById = async (userId, orderId) => {
  const order = await Order.findOne({
    _id: orderId,
    userId
  }).populate("products.productId");

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

export const cancelOrder = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, userId });

  if (!order) {
    throw new Error("Order not found");
  }

  
  if (order.status === "cancelled") {
    throw new Error("Order already cancelled");
  }

  
  if (order.status === "shipped" || order.status === "delivered") {
    throw new Error("Order cannot be cancelled after shipping");
  }

  
  order.status = "cancelled";

  
  for (let item of order.products) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: item.quantity }
    });
  }

  await order.save();

  return order;
};