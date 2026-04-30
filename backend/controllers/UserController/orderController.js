import * as orderService from "../../services/orderService.js";

export const checkout = async (req, res) => {
  try {
    const { address, paymentMethod } = req.body;

    const order = await orderService.createOrder(
      req.user.id,
      address,
      paymentMethod
    );

    res.status(201).json({
      success: true,
      data: order
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


export const getMyOrders = async (req, res) => {
  try {
    const orders = await orderService.getUserOrders(req.user.id);

    res.json({
      success: true,
      data: orders
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};  

export const getOrderDetails = async (req, res) => {
  try {
    const order = await orderService.getOrderById(
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    res.status(404).json({
      message: error.message
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await orderService.cancelOrder(
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: order
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};