import { AuthRequest } from "../middleware/authmiddleware";
import { Response } from "express";
import { OrderData, PaymentMethod } from "../types/orderTypes";
import Order from "../database/models/Order";
import Payment from "../database/models/Payment";
import OrderDetail from "../database/models/OrderDetails";

const items = [{
    quantity :2,
    productId :2
}]

class OrderController{
    // items is array which contains orderdetails table items
    async createOrder(req: AuthRequest,res:Response):Promise<void>{
        const userId = req.user?.id
    const {phoneNumber , shippingAddress , totalAmount,PaymentDetails,items}:OrderData = req.body  
    if(!phoneNumber || !shippingAddress || !totalAmount || !PaymentDetails || !PaymentDetails.paymentMethod || items.length == 0){
        res.status(400).json({
        message:    "Please provide phoneNumber , shippingAddress,totalAmount,paymentDetails,items"
    })
        return  
    }


  const OrderData =  await Order.create({
        phoneNumber,
        shippingAddress,
        totalAmount,
        userId

    })
     await Payment.create({
        PaymentMethod : PaymentDetails.paymentMethod

     })
     for(var i = 0; i<items.length ; i++){
        await OrderDetail.create({
            quantity : items[i].quantity,
            productId : items[0].productId,
            orderId : OrderData.id
        })
     }
     if(PaymentDetails.paymentMethod === PaymentMethod.khalti){
        //khalti integration
     }else{
        res.status(200).json({
            message : "Order placed sucessfully"
        })
     }
}
}