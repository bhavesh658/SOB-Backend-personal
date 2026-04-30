import express from "express";
import cors from "cors";


import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import authRoutes from "./routes/authRoutes.js";


import profileRoutes from "./routes/UserModuleRoutes/profileRoutes.js";
import UserproductRoutes from "./routes/UserModuleRoutes/productRoutes.js";
import cartRoutes from "./routes/UserModuleRoutes/cartRoutes.js";







const app = express();

app.use(cors());
app.use(express.json());


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
app.use("/api/user/products", UserproductRoutes);
app.use("/api/user/cart", cartRoutes);


app.use("/uploads", express.static("uploads"));


app.get("/", (req, res) => {
  res.send("API Running...");
});

export default app;