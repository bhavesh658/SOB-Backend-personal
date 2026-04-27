import User from "../models/User.js";

// ✅ Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;

    const users = await User.find()
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments();

    res.status(200).json({ total, page, users });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch users" });
  }
};


// ✅ Block / Unblock User
export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      msg: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update user" });
  }
};


// ✅ Search Users
export const searchUsers = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const users = await User.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } }
      ]
    }).select("-password");

    res.status(200).json(users);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Search failed" });
  }
};


// ✅ Filter Users
export const filterUsers = async (req, res) => {
  try {
    const { status } = req.query;

    const query =
      status === "blocked" ? { isBlocked: true } :
      status === "active" ? { isBlocked: false } : {};

    const users = await User.find(query).select("-password");

    res.status(200).json(users);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Filter failed" });
  }
};