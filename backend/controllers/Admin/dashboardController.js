import User from "../../models/User.js";
import Order from "../../models/Order.js";

export const getDashboardData = async (req, res) => {
  try {
    // ✅ Total Users
    const totalUsers = await User.countDocuments();

    // ✅ Total Orders
    const totalOrders = await Order.countDocuments();

    // ✅ Total Revenue (only paid or delivered orders)
    const revenueData = await Order.aggregate([
      {
        $match: { paymentStatus: "paid" }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // ✅ Recent Orders (latest 5)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email");

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalRevenue,
        recentOrders
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
      error: error.message
    });
  }
};