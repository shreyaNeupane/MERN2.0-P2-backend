import { where } from "sequelize";
import Category from "../database/models/Category";
import { Request, Response } from "express";
class CategoryController {
  categoryData = [
    {
      categoryName: "Electronics",
    },
    {
      categoryName: "Groceries",
    },
    {
      categoryName: "Food/Beverages",
    },
  ];
  async seedCategory(): Promise<void> {
    const datas = await Category.findAll();
    if (datas.length === 0) {
      const data = await Category.bulkCreate(this.categoryData);
      console.log("Categories seeded sucessfully");
    } else {
      console.log("Categories already seeded");
    }
  }
  // to add category
  async addCategory(req: Request, res: Response): Promise<void> {
    const { categoryName } = req.body;
    if (!categoryName) {
      res.status(400).json({ message: "Please provide categoryName" });
      return;
    }
    await Category.create({
      categoryName,
    });
    res.status(200).json({
      message: "category added sucessfully",
    });
  }

  // to get category

  async getCategories(req: Request, res: Response): Promise<void> {
    const data = await Category.findAll();
    res.status(200).json({
      message: "categories fetched",
      data,
    });
  }

  // to delete category
  async deleteCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data = await Category.findAll({
      where: { id },
    });
    if (data.length === 0) {
      res.status(404).json({
        message: "No product with that ID",
      });
    } else {
      await Category.destroy({
        where: { id },
      });
      res.status(200).json({
        message: "Category deleted",
      });
    }
  }

  // to update category
  async updateCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { categoryName } = req.body;
    await Category.update(
      { categoryName },
      {
        where: {
          id,
        },
      }
    );
    res.status(200).json({
      message: "Category is updated",
    });
  }
}
export default new CategoryController();
