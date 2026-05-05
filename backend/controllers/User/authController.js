import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-env";
const JWT_EXPIRE = "7d";


// ================= TOKEN =================
const generateToken = (id, role) =>
  jwt.sign({ id, role }, JWT_SECRET, { expiresIn: JWT_EXPIRE });


// ================= HELPERS =================
const validateRegister = ({ name, email, password, confirmPassword }) => {
  if (!name || !email || !password || !confirmPassword)
    return "All fields are required";

  if (password.length < 6)
    return "Password must be at least 6 characters";

  if (password !== confirmPassword)
    return "Passwords do not match";

  return null;
};

const validateLogin = ({ email, password }) => {
  if (!email || !password)
    return "Email and password are required";

  return null;
};

const getRole = (role) => {
  const allowedRoles = ["user", "admin"];
  return allowedRoles.includes(role) ? role : "user";
};

const sendError = (res, status, message) =>
  res.status(status).json({ success: false, message });


// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const error = validateRegister(req.body);
    if (error) return sendError(res, 400, error);

    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser)
      return sendError(res, 400, "Email already registered");

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: getRole(role),
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};


// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const error = validateLogin(req.body);
    if (error) return sendError(res, 400, error);

    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return sendError(res, 401, "Invalid email or password");

    if (user.isBlocked)
      return sendError(res, 403, "Your account has been blocked");

    const isValid = await bcryptjs.compare(password, user.password);
    if (!isValid)
      return sendError(res, 401, "Invalid email or password");

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};


// ================= LOGOUT =================
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};


// ================= CHANGE PASSWORD =================
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword)
      return sendError(res, 400, "All fields are required");

    if (newPassword.length < 6)
      return sendError(res, 400, "Password must be at least 6 characters");

    if (newPassword !== confirmPassword)
      return sendError(res, 400, "Passwords do not match");

    const user = await User.findById(req.user.id);
    if (!user) return sendError(res, 404, "User not found");

    const isValid = await bcryptjs.compare(
      currentPassword,
      user.password
    );
    if (!isValid)
      return sendError(res, 401, "Current password is incorrect");

    user.password = await bcryptjs.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};


// ================= REFRESH TOKEN =================
export const refreshToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return sendError(res, 404, "User not found");

    const newToken = generateToken(user._id, user.role); 

    res.cookie("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      token: newToken,
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};