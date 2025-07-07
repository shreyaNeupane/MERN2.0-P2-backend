import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authmiddleware";
import Cart from "../database/models/Cart";
import Product from "./../database/models/Product";

class CartController {
  async addToCart(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const { quantity, productId } = req.body;
    if (!quantity || !productId) {
      res.status(400).json({
        message: "Please provide quantity,productId",
      });
    }

    //check if the product already exists in table or not
    //findOne finds object
    let cartItem = await Cart.findOne({
      where: {
        productId,
        userId,
      },
    });
    if (cartItem) {
      cartItem.quantity = quantity;
      // to save  quantity in object permanantly
      await cartItem.save();
    } else {
      //insert into cart
      cartItem = await Cart.create({
        quantity,
        userId,
        productId,
      });
    }
    res.status(200).json({
      message: "Product added t cart",
      data: cartItem,
    });
  }
}
export default new CartController();
