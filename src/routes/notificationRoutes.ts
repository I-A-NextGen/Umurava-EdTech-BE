import { Router } from "express";
import authenticate from "../middleware/auth.middleware";
import {
  sendNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification,
  clearUserNotifications,
} from "../controllers/notificationController";

const router = Router();

router.post("/send", sendNotification);
router.get("/", authenticate, getUserNotifications);
router.patch("/read/:notificationId",authenticate, markAsRead);
router.delete("/delete/:notificationId", authenticate,deleteNotification);
router.delete("/clear/", authenticate, clearUserNotifications);

export default router;
