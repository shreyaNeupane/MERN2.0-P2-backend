import { Request, Response } from "express";
import Product from "../database/models/Product";
import { AuthRequest } from "./../middleware/authmiddleware";
import Category from "./../database/models/Category";
import User from "../database/models/User";

class ProductController {
  //  to add product
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
  // to get all products
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

  // to get single product
  async getSingleProduct(req:Request,res:Response):Promise<void>{
    const id = req.params.id 
    const data = await Product.findAll({
      where: {
        id  : id
      }
    })
    if(data.length == 0){
      res.status(404).json({
        message : "No product with that id"
      })
    }else{
      res.status(200).json({
        message : "Product fetched sucessfully",
        data
      })
    }
  }
// to delte product
  async deleteProduct(req : Request , res:Response) : Promise<void>{
    const {id} = req.params
    const data = await Product.findAll({
      where : {
        id : id
      }
    })
    if(data.length > 0){
      await Product.destroy({
        where : {
          id : id
        }
      })
      res.status(200).json({
        message: "Product deleted sucuessfully",
      });
    }else{
      res.status(404).json({
        message: "No product with that ID",
      });
    }
   
  }
}

export default new ProductController();
