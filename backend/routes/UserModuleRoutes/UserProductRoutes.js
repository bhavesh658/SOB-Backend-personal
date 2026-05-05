// backend/routes/productRoutes.js
import express from "express";
import { getProductById ,browseProducts} from "../../controllers/User/UserProductController.js";


const router = express.Router();

router.get("/browse", browseProducts);

router.get("/:id", getProductById);

export default router;