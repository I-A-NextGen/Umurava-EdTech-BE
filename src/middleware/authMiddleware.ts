import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/errorsUtils";
import User, { UserRoles } from "../models/userModel";

interface IJwtPayload extends jwt.JwtPayload {
  sub: string;
  email: string;
  role: UserRoles;
}

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.headers.authorization;

    if (!token) {
      throw new AppError(
        "fail",
        401,
        "JWT token is required for authorization.",
        true
      );
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500).json({
        status: "error",
        message: "Secret key is not defined",
      });
      return;
    }

    const decodedToken = jwt.verify(token, jwtSecret) as IJwtPayload;

    const user = await User.findById(decodedToken.sub);
    if (!user) throw new AppError("fail", 404, "User not found.", true);

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
