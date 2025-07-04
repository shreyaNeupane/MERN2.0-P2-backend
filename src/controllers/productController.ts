import { Request, Response } from "express";
import Product from "../database/models/Product";
import { AuthRequest } from "./../middleware/authmiddleware";
import Category from "./../database/models/Category";
import User from "../database/models/User";

class ProductController {
  async addProduct(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const {
      productName,
      productDescription,
      productTotalstockQty,
      productPrice,
      categoryId,
    } = req.body;

    let fileName;
    if (req.file) {
      fileName = req.file?.filename;
    } else {
      fileName = "https://www.neostore.com.np/assets/uploads/uture_tour_2.jpg";
    }
    if (
      !productName ||
      !productDescription ||
      !productTotalstockQty ||
      !productPrice ||
      !categoryId
    ) {
      res.status(400).json({
        message:
          "Please provide productName,productDescription , productTotalstockQty, productPrice , categoryId",
      });
      return;
    }
    await Product.create({
      productName,
      productDescription,
      productTotalstockQty,
      productPrice,
      productImageUrl: fileName,
      userId: userId,
      categoryId: categoryId,
    });
    res.status(200).json({
      message: "product added sucessfully",
    });
  }
  async getAllProducts(req: Request, res: Response): Promise<void> {
    const data = await Product.findAll({
      //User table ko data pani print hune vayo becaue user is connected to product table
      include: [
        {
          model: User,
          attributes: ['id','email','username'],
        },
        {
          model: Category,
          attributes: ["categoryName"],
        },
      ],
    });
    res.status(200).json({
      message: "Products fetched sucessfully",
      data,
    });
  }
}

export default new ProductController();
