import Notification from "../models/notification.model";
import { getIO } from "../socket";

class NotificationService {
  async sendNotification(title: string, description: string, to: string) {
    const notification = await Notification.create({ title, description, to });
    const io = getIO();
    io.to(to).emit("newNotification", notification);
    return notification;
  }

  async getUserNotifications(userId: string) {
    return await Notification.find({ to: userId }).sort({ createdAt: -1 });
  }

  async markAsRead(notificationId: string) {
    return await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
  }

  async deleteNotification(notificationId: string) {
    return await Notification.findByIdAndDelete(notificationId);
  }

  async clearUserNotifications(userId: string) {
    return await Notification.deleteMany({ to: userId });
  }
}

export default new NotificationService();
