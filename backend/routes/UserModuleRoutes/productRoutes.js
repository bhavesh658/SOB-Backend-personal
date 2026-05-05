// backend/routes/productRoutes.js
import express from "express";
import { getProductById } from "../../controllers/UserController/productController.js";
import { browseProducts } from "../../controllers/UserController/browseController.js";


const router = express.Router();

router.get("/browse", browseProducts);

router.get("/:id", getProductById);

export default router;