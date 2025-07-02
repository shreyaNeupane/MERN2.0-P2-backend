import { Request, Response } from "express";
import User from "../database/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {
  public static async registerUser(req: Request, res: Response): Promise<void> {

      const { username, email, password, role } = req.body;
      if (!username || !email || !password ) {
        res.status(400).json({
          message: "Please provide username,email,password",
        });
        return;
      }
      await User.create({
        username,
        email,
        password: bcrypt.hashSync(password, 8),
        role: role,
      });

      res.status(200).json({
        message: "User registered sucessfully",
      });
   
  }

  //for login
  public static async loginUser(req: Request, res: Response): Promise<void> {
    //user input
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "Please provide email,password",
      });
      return;
    }
    //check wheather user with above email exist or not
    // here data is destrucred so that value of login credentials can be stored as object
    const [data] = await User.findAll({
      where: {
        email: email,
      },
    });
    if (!data) {
      res.status(404).json({
        message: "No user with that email",
      });
      return;
    }

    //check password if email exists      compareSync(user le enter gareko ps , data ma store vako ps)
    const isMatched = bcrypt.compareSync(password, data.password);
    if (!isMatched) {
      res.status(403).json({
        message: "Invalid password",
      });
      return;
    }
    //generate token
    //id vanne key ma table ko id id garne
    const token = jwt.sign({ id: data.id }, process.env.SECERT as string, {
      expiresIn: "20d",
    });
    res.status(200).json({
      message: "logged in sucessfully",
      data: token,
    });
  }
}
export default AuthController;
