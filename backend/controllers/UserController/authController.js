import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 🔹 Validators
const validateRegisterInput = ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }
};

const validateLoginInput = ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password required");
  }
};

// 🔹 User Checks
const checkUserExists = async (email) => {
  const user = await User.findOne({ email });
  if (user) throw new Error("User already exists");
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  return user;
};

const checkBlockedUser = (user) => {
  if (user.isBlocked) {
    throw new Error("User is blocked");
  }
};

// 🔹 Password
const hashPassword = (password) => bcrypt.hash(password, 10);

const comparePassword = async (password, hash) => {
  const isMatch = await bcrypt.compare(password, hash);
  if (!isMatch) throw new Error("Invalid credentials");
};

// 🔹 Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// 🔹 Cookie
const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

// ======================= CONTROLLERS =======================

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    validateRegisterInput({ name, email, password });

    await checkUserExists(email);

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      msg: "User registered successfully",
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    validateLoginInput({ email, password });

    const user = await getUserByEmail(email);

    checkBlockedUser(user);

    await comparePassword(password, user.password);

    const token = generateToken(user);

    setAuthCookie(res, token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      success: true,
      msg: "Login successful",
      token
    });

  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// LOGOUT
export const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0)
  });

  res.json({
    success: true,
    message: "Logged out successfully"
  });
};