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

export const failResponse = (
  res: Response,
  statusCode: number,
  message: string,
  // detail: unknown,
  details?: unknown
): Response => {
  return res.status(statusCode).json({
    status: "fail",
    message,
    details:
      process.env.NODE_ENV !== "production" ? details || null : undefined,
  });
};

export const errorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  details?: unknown
): Response => {
  return res.status(statusCode).json({
    status: "error",
    message,
    details:
      process.env.NODE_ENV !== "production" ? details || null : undefined,
  });
};
