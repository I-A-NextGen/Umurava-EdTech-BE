import { NextFunction, Request, Response } from "express";
import {
  loginUserSchema,
  registerUserSchema,
} from "../validators/auth.validators";
import loginUser from "../services/userServices/login.service";
import { successResponse } from "../utils/responses.utils";
import registerUser from "../services/userServices/registration.service";
import { getProfileByUserId } from "../services/userServices/profile.service";
import { AppError } from "../utils/errors.utils";

export const postRegisterUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error } = registerUserSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) throw error;

    const user = await registerUser(req.body);

    successResponse(res, 201, "User registered successfully", {
      user,
    } as unknown as Record<string, object>);
    return;
  } catch (error) {
    next(error);
  }
};

export const postLoginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = loginUserSchema.validate(req.body, { abortEarly: false });

    if (error) throw error;

    const jwt = await loginUser(req.body);

    if (jwt) {
      successResponse(res, 200, "User login successful.", {
        token: jwt,
      } as unknown as Record<string, object>);
    }
    return;
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("fail", 401, "Unauthorized", true);
    }

    const profile = await getProfileByUserId(userId);
    if (!profile) {
      throw new AppError("fail", 404, "Profile not found", true);
    }

    res.status(200).json({ status: "success", data: profile });
  } catch (error) {
    next(error);
  }
};
