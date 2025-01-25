import { Request, Response, NextFunction } from "express";
import { errorResponse, failureResponse } from "../utils/responsesUtils";
import { AppError } from "../utils/errorsUtils";
import mongoose from "mongoose";
import Joi from "joi";
import { JsonWebTokenError } from "jsonwebtoken";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let customError: Partial<AppError> = err;

  // Mongoose errors
  if (err instanceof mongoose.Error.ValidationError) {
    customError = new AppError("failure", 422, err.message, true, err.errors);
  }
  if (err instanceof mongoose.Error.CastError) {
    customError = new AppError(
      "failure",
      400,
      `Invalid ${err.path}: ${err.value}`,
      true,
      { stack: { stack: err.stack } }
    );
  }
  if (err.name === "MongoServerError") {
    customError = new AppError("error", 500, err.message, true);
  }

  // Joi errors
  if (Joi.isError(err)) {
    const errorDetails = err.details.map((error) => ({
      field: error.path.join(", ") || "unknown",
      message: error.message || "Invalid input",
    }));
    customError = new AppError(
      "failure",
      400,
      "Validation Error: Please ensure your input is correct.",
      true,
      errorDetails
    );
  }
  // jwt errors
  if (err instanceof JsonWebTokenError) {
    switch (err.name) {
      case "TokenExpiredError":
        customError = new AppError(
          "failure",
          401,
          "Token has expired. Please log in again.",
          true,
          { stack: err.stack }
        );
        break;
      case "JsonWebTokenError":
        customError = new AppError(
          "failure",
          401,
          "Invalid token. Please log in again.",
          true,
          { stack: err.stack }
        );
        break;
      default:
        customError = new AppError(
          "failure",
          401,
          "An authentication error occurred.",
          true,
          { stack: err.stack }
        );
    }
  }

  // unknown errors
  if (!(customError instanceof AppError)) {
    customError = new AppError("error", 500, "Internal Server Error", false, {
      stack: err.stack,
    });
  }

  if (customError.status! === "failure") {
    failureResponse(res, customError.statusCode!, customError.message!);
    return;
  }

  errorResponse(res, customError.statusCode!, customError.message!);
  return;
};

export default errorHandler;
