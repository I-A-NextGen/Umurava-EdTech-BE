import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.utils";
import User, { UserRoles } from "../models/user.model";

const authorize =
  (...roles: Array<UserRoles>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError("fail", 401, "Unauthorized: No user found.", true);
      }

      const user = await User.findById(req.user.id);

      if (!user) {
        throw new AppError("fail", 401, "Unauthorized: No user found.", true);
      }

      if (!roles.includes(user.role)) {
        throw new AppError("fail", 403, "Forbidden: Access denied.", true);
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default authorize;
