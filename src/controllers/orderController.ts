import { AuthRequest } from "../middleware/authmiddleware";
import { Response } from "express";
import { KhaltiResponse, OrderData, PaymentMethod } from "../types/orderTypes";
import Order from "../database/models/Order";
import Payment from "../database/models/Payment";
import OrderDetail from "../database/models/OrderDetails";
import axios, { Axios } from "axios";

class OrderController {
  // items is array which contains orderdetails table items
  async createOrder(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const {
      phoneNumber,
      shippingAddress,
      totalAmount,
      PaymentDetails,
      items,
    }: OrderData = req.body;
    if (
      !phoneNumber ||
      !shippingAddress ||
      !totalAmount ||
      !PaymentDetails ||
      !PaymentDetails.paymentMethod ||
      items.length == 0
    ) {
      res.status(400).json({
        message:
          "Please provide phoneNumber , shippingAddress,totalAmount,paymentDetails,items",
      });
      return;
    }

    const paymentData = await Payment.create({
      PaymentMethod: PaymentDetails.paymentMethod,
    });
    const OrderData = await Order.create({
      phoneNumber,
      shippingAddress,
      totalAmount,
      userId,
      paymentId: paymentData.id,
    });
    for (var i = 0; i < items.length; i++) {
      await OrderDetail.create({
        quantity: items[i].quantity,
        productId: items[i].productId,
        orderId: OrderData.id,
      });
    }
    if (PaymentDetails.paymentMethod === PaymentMethod.khalti) {
      //khalti integration
      const data = {
        // payment sucess vayepaxi redirect hune url
        return_url: "http://localhost:3000/sucess",
        purchase_order_id: OrderData.id,
        // converting into paisa
        amount: totalAmount * 100,
        website_url: "http://localhost:3000/",
        purchase_order_name: "orderName_" + OrderData.id,
      };
      const response = await axios.post(
        "https://dev.khalti.com/api/v2/epayment/initiate/",
        data,
        {
          headers: {
            Authorization: " key 417c570c28154ed9b9d6c9108dc460f4",
          },
        }
      );
      const KhaltiResponse: KhaltiResponse = response.data;
      paymentData.pidx = KhaltiResponse.pidx;
      paymentData.save();
      res.status(200).json({
        message: "order placed sucessfully",
        url: KhaltiResponse.payment_url,
      });
    } else {
      res.status(200).json({
        message: "Order placed sucessfully",
      });
    }
  }
}

export default new OrderController();
