import Order from "../models/Order.js";
import User from "../models/User.js";

//  SALES REPORT
export const getSalesReport = async (req, res) => {
  try {
    
    const totalRevenueData = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    
    const totalOrders = await Order.countDocuments();


    const dailySales = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          totalSales: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalRevenue: totalRevenueData[0]?.total || 0,
        totalOrders,
        dailySales
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// USER REPORT
export const getUserReport = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const newUsers = await User.aggregate([
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        newUsers
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};