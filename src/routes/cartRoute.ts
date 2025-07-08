import cartController from "../controllers/cartController";
import authmiddleware, { Role } from "../middleware/authmiddleware";
import express, { Router } from "express";
const router: Router = express.Router();

router
  .route("/")
  .post(authmiddleware.isAuthenticated, cartController.addToCart)
  .get(authmiddleware.isAuthenticated, cartController.getMyCarts);

router
  .route("/:productId")
  .patch(authmiddleware.isAuthenticated, cartController.updateCartItem)
  .delete(authmiddleware.isAuthenticated, cartController.deleteMyCartItem)

export default router;
