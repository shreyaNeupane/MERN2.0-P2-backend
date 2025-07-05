import express, { Router } from "express";
import { multer, storage } from "../middleware/multerMiddleware";
import authmiddleware, { Role } from "../middleware/authmiddleware";
import productController from "../controllers/productController";

const upload = multer({ storage: storage });
const router: Router = express.Router();
// http://localhost:3000/admin/product/
router.route("/")
  .post(
    authmiddleware.isAuthenticated,
    authmiddleware.restrictTo(Role.Admin),
    upload.single("image"),
    productController.addProduct
  )
  .get(productController.getAllProducts);
// http://localhost:3000/admin/product/:id
router.route("/:id").get(productController.getSingleProduct)
.delete(authmiddleware.isAuthenticated,authmiddleware.restrictTo(Role.Admin),productController.deleteProduct)

export default router;
