import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";




import userRoutes from "./routes/AdminModuleRoutes/userRoutes.js";
import productRoutes from "./routes/AdminModuleRoutes/productRoutes.js";
import categoryRoutes from "./routes/AdminModuleRoutes/categoryRoutes.js";
import orderRoutes from "./routes/AdminModuleRoutes/orderRoutes.js";
import dashboardRoutes from "./routes/AdminModuleRoutes/dashboardRoutes.js";
import reviewRoutes from "./routes/AdminModuleRoutes/reviewRoutes.js";
import bannerRoutes from "./routes/AdminModuleRoutes/bannerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/AdminModuleRoutes/reportRoutes.js";

import profileRoutes from "./routes/UserModuleRoutes/UserProfileRoutes.js";
import UserproductRoutes from "./routes/UserModuleRoutes/UserProductRoutes.js";
import cartRoutes from "./routes/UserModuleRoutes/UserCartRoutes.js";
import UserorderRoutes from "./routes/UserModuleRoutes/UserOrderRoutes.js";
import UserreviewRoutes from "./routes/UserModuleRoutes/UserReviewRoutes.js";






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
app.use("/api/admin/reports", reportRoutes);

// User Routes
app.use("/api/user/profile", profileRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user/products", UserproductRoutes);
app.use("/api/user/cart", cartRoutes);
app.use("/api/user/orders", UserorderRoutes);
app.use("/api/user/reviews", UserreviewRoutes);

app.use("/uploads", express.static("uploads"));


app.get("/", (req, res) => {
  res.send("API Running...");
});

export default app;
