import { Response } from "express";

// Custom predefined API responses format
export const successResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: Record<string, object> | undefined,
  details?: unknown
): Response =>
  res.status(statusCode).json({
    status: statusCode === 207 ? "multi_status" : "success",
    message,
    details,
    data,
  });

export const failureResponse = (
  res: Response,
  statusCode: number,
  message: string,
  stack?: unknown
): Response => {
  return res.status(statusCode).json({
    status: "failure",
    message,
    stack: process.env.NODE_ENV === "development" ? stack || null : undefined,
  });
};

export const errorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  stack?: unknown
): Response => {
  return res.status(statusCode).json({
    status: "error",
    message,
    stack: process.env.NODE_ENV === "development" ? stack || null : undefined,
  });
};
