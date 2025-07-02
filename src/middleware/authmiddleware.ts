import { NextFunction, Request, Response } from "express";
const jwt = require("jsonwebtoken");
import User from "../database/models/User";
import errorHandler from "./../services/catchAsyncError";

interface AuthRequest extends Request {
  user?: {
    username: string;
    email: string;
    role: string;
    password: string;
    id: string;
  };
}
enum Role {
  Admin = "admin",
  Customer = "customer",
}
class AuthMiddleware {
  async isAuthenticated(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    //get token form user
    const token = req.headers.authorization;
    if (!token || token === undefined) {
      res.status(403).json({
        message: "Token not provided",
      });
      return;
    }
    //verify token if it is legit or tampared
    jwt.verify(
      token,
      process.env.SECERT_KEY as string,
      async (err: any, decoded: any) => {
        if (err) {
          const userData = await User.findByPk(decoded.id);
        } else {
          //check if that decoded object id user exist or no
          try {
            const userData = await User.findByPk(decoded.id);
            if (!userData) {
              res.status(404).json({
                message: "No user with that token",
              });
              return;
            }
            req.user = userData;
            next();
          } catch (error) {
            res.status(500).json({
              message: "Something went wrong",
            });
          }
        }
      }
    );
  }
  restrictTo(...roles: Role[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      let userRole = req.user?.role as Role;
      if (!roles.includes(userRole)) {
        res.status(403).json({
          message: "you dont have permission",
        });
      } else {
        next();
      }
    };
  }
}
export default new AuthMiddleware();
