import { Model, model, Schema, Types, models } from "mongoose";

interface INotification {
  _id: Types.ObjectId;
  title: string;
  description: string;
  to: Types.ObjectId;
  isRead: boolean;
}

const notificationSchema = new Schema<INotification, Model<INotification>>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    to: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = models.Notification || model<INotification>("Notification", notificationSchema);

export default Notification;
