import { AuthRequest } from "../middleware/authmiddleware";
import { Response } from "express";
import { KhaltiResponse, OrderData, OrderStatus, PaymentMethod, TransactionStatus, TransactionVerificationResponse } from "../types/orderTypes";
import Order from "../database/models/Order";
import Payment from "../database/models/Payment";
import axios, { AxiosResponse } from "axios";
import OrderDetail from './../database/models/OrderDetails';
import Product from "../database/models/Product";

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
  async verifyTransaction(req: AuthRequest, res: Response): Promise<void> {
    const { pidx } = req.body;
    if (!pidx) {
      res.status(400).json({
        message: "Please provides pdix",
      });
      return;
    }
    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: " key 417c570c28154ed9b9d6c9108dc460f4",
        },
      }
    );
    const data: TransactionVerificationResponse = response.data;
    if (data.status === TransactionStatus.Completed) {
      await Payment.update(
        { paymentStatus: "paid" },
        {
          where: {
            pidx: pidx,
          },
        }
      );
      console.log("Received pidx:", pidx);

      res.status(200).json({
        message: "Payment verified sucessfully",
      });
    } else {
      res.status(200).json({
        message: "Payment not verified",
      });
    }
  }
  //------customer SIDE starts------
  // to fetch order
  async fetchMyOrders(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const orders = await Order.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Payment,
        },
      ],
    });
    if (orders.length > 0) {
      res.status(200).json({
        message: "order fetched sucessfully",
        data: orders,
      });
    } else {
      res.status(404).json({
        message: "you haven't ordered anything yet ...",
        data: [],
      });
    }
  }
  // to fetch orderDetails
  async fetchOrderDetails(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const orderId = req.params.id;
    const orderDetails = await OrderDetail.findAll({
      where: {
        orderId,
      },
      include: [
        {
          model: Product,
        },
      ],
    });
    if (orderDetails.length > 0) {
      res.status(200).json({
        message: "orderDetails fetched sucessfully",
        data: orderDetails,
      });
    } else {
      res.status(404).json({
        message: "no any orders of that id",
        data: [],
      });
    }
  }

  // cancel order

  async cancelMyOder(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const orderId = req.params.id;
    const order: any = await Order.findAll({
      where: {
        userId,
        id: orderId,
      },
    });
    if (
      order?.OrderStatus === OrderStatus.Ontheway ||
      order?.OrderStatus == OrderStatus.prepration
    ) {
      res.status(200).json({
        message:
          "you cannot cancel order when its is on the way or in prepration process",
      });
      return;
    }
    await Order.update(
      { OrderStatus: OrderStatus.Cancelled },
      {
        where: {
          id: orderId,
        },
      }
    );
    res.status(200).json({
      message: "Order cancelled sucessfully",
    });
  }
  // ------customer SIDE ends -------------
}

export default new OrderController();
