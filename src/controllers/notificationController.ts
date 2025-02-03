import { Request, Response, NextFunction } from "express";
import notificationService from "../services/notificationService";
import { successResponse } from "../utils/responses.utils";

export const sendNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { title, description, to } = req.body;
      const notification = await notificationService.sendNotification(title, description, to);
      res.status(201).json(successResponse(res, 201, "Notification sent successfully", { notification }));
    } catch (error) {
      next(error);
    }
  };
  
  export const getUserNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const notifications = await notificationService.getUserNotifications(userId);
      res.status(200).json(successResponse(res, 200, "User notifications retrieved", { notifications }));
    } catch (error) {
      next(error);
    }
  };
  
  export const markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { notificationId } = req.params;
      const notification = await notificationService.markAsRead(notificationId);
      if (!notification) {
        return next(new Error("Notification not found"));
      }
      res.status(200).json(successResponse(res, 200, "Notification marked as read", { notification }));
    } catch (error) {
      next(error);
    }
  };
  
  export const deleteNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { notificationId } = req.params;
      const deleted = await notificationService.deleteNotification(notificationId);
      if (!deleted) {
        return next(new Error("Notification not found"));
      }
      res.status(200).json(successResponse(res, 200, "Notification deleted successfully", {}));
    } catch (error) {
      next(error);
    }
  };
  
  export const clearUserNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      await notificationService.clearUserNotifications(userId);
      res.status(200).json(successResponse(res, 200, "All notifications cleared", {}));
    } catch (error) {
      next(error);
    }
  };
