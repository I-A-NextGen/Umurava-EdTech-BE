import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.headers.authorization;

    if (!token) {
      throw new Error();
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500).json({
        status: "error",
        message: "Secret key is not defined",
      });
      return;
    }

    jwt.verify(token, jwtSecret);
  } catch (error) {}
};

export default authenticate;
