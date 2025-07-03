import {Request, Response} from 'express'
import Product from '../database/models/Product'

class ProductController{
    async addProduct(req:Request , res: Response):Promise<void>{
        const{productName , productDescription , productTotalstockQty, productPrice} =req.body;
        let fileName
        if(req.file){
            fileName = req.file?.filename
        }else{
            fileName =
              "https://www.neostore.com.np/assets/uploads/uture_tour_2.jpg";
          
        }
        if(!productName || !productDescription || !productTotalstockQty || !productPrice){
            res.status(400).json({
              message:
                "Please provide productName,productDescription , productTotalstockQty, productPrice",
            });
            return
        }
        await Product.create({
          productName,
          productDescription,
          productTotalstockQty,
          productPrice,
          productImageUrl : fileName
        });
        res.status(200).json({
            message : "product added sucessfully"
        })
    }
}

export default new ProductController