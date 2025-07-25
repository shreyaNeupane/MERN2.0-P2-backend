import express, { Application, Request, Response } from "express";
const app: Application = express();
const PORT: number = 3000;

import dotenv from "dotenv";
dotenv.config();

import("./database/connection");
import userRoute from "./routes/userRoute";
import productRoute from "./routes/productRoute";
import categoryRoute from "./routes/categoryRoute";
import adminSeeder from "./adminSeeder";
import categoryController from "./controllers/categoryController";
import cartRoute from "./routes/cartRoute";
import orderRoute from "./routes/orderRoute";
app.use(express.json());

//admin seeder
adminSeeder();
// localhost:300/register
app.use("", userRoute);
app.use("/admin/product", productRoute);
app.use("/admin/category",categoryRoute);
app.use("/customer/cart",cartRoute);
app.use("/order" ,orderRoute)
app.listen(PORT, () => {
  // category seeder
  categoryController.seedCategory();
  console.log("Server has started at port ", PORT);
});
