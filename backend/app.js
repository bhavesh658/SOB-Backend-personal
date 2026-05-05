import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import profileRoutes from "./routes/UserModuleRoutes/profileRoutes.js";
import productRoutess from "./routes/UserModuleRoutes/productRoutes.js";
import productBrowseRoutes from "./routes/UserModuleRoutes/productBrowseRoutes.js";


const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // Allow cookies
  }),
);
app.use(express.json());
app.use(cookieParser()); // Parse cookies

//Admin Routes

app.use("/api/admin/users", userRoutes);
app.use("/api/admin/products", productRoutes);
app.use("/api/admin/categories", categoryRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/admin/reviews", reviewRoutes);
app.use("/api/admin/orders", orderRoutes);
app.use("/api/admin/banners", bannerRoutes);

// User Routes
app.use("/api/user/profile", profileRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/user/products", productRoutess);
// user browsing
app.use("/api/user/productsBrowse", productBrowseRoutes);

app.use("/uploads", express.static("uploads"));


app.get("/", (req, res) => {
  res.send("API Running...");
});

export default app;
