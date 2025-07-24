import express, { Router } from "express";
import authmiddleware, { Role } from "../middleware/authmiddleware";
import errorHandler from "../services/catchAsyncError";
import orderController from "../controllers/orderController";
const router: Router = express.Router();

router
  .route("/")
  .post(
    authmiddleware.isAuthenticated,
    errorHandler(orderController.createOrder)
  );
router
  .route("/verify")
  .post(
    authmiddleware.isAuthenticated,
    errorHandler(orderController.verifyTransaction)
  );
//fetch order
router
  .route("/customer")
  .get(
    authmiddleware.isAuthenticated,
    errorHandler(orderController.fetchMyOrders)
  );

// cancel order
router
  .route("/customer/:id")
  .patch(
    authmiddleware.isAuthenticated,
    authmiddleware.restrictTo(Role.Customer),
    errorHandler(orderController.cancelMyOder)
  )
  .get(
    authmiddleware.isAuthenticated,
    errorHandler(orderController.fetchOrderDetails)
  );

router
  .route("/admin/payment/:id")
  .patch(
    authmiddleware.isAuthenticated,
    authmiddleware.restrictTo(Role.Admin),
    errorHandler(orderController.changePaymentStatus)
  );

router
  .route("/admin/:id")
  .patch(
    authmiddleware.isAuthenticated,
    authmiddleware.restrictTo(Role.Admin),
    errorHandler(orderController.changeOrderStatus)
  )
  .delete(
    authmiddleware.isAuthenticated,
    authmiddleware.restrictTo(Role.Admin),
    errorHandler(orderController.deleteOrder)
  );

export default router;
