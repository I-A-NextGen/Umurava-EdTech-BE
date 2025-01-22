import { Model, model, Schema, Types } from "mongoose";

interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  status: boolean;
  twoFAEnabled: boolean;
  otp: {
    otp: string;
    expires: Date;
  }
  notification: {
    email: boolean;
    inApp: boolean;
  };
}

const userSchema = new Schema<IUser, Model<IUser>>(
  {
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    twoFAEnabled: {
      type: Boolean,
      default: true
    },
    notification: {
      type: new Schema<IUser["notification"]>({
        email: {
          type: Boolean,
          default: true,
        },
        inApp: {
          type: Boolean,
          default: true,
        },
      }),
      default: () => ({}),
    },
    otp: {
      type: new Schema<IUser['otp']>({
        otp: String,
        expires: Date
      })
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.virtual("profile", {
  ref: "Profile",
  foreignField: 'user',
  localField: '_id',
  justOne: true
});


const User = model<IUser, Model<IUser>>("User", userSchema);

export default User;
