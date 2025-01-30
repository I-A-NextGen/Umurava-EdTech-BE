import { Model, model, Schema, Types, models } from "mongoose";
import bcrypt from "bcryptjs";

export enum UserRoles {
  ADMIN = "ADMIN",
  TALENT = "TALENT",
  CLIENT = "CLIENT",
}

interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  status: string;
  role: UserRoles;
  twoFAEnabled: boolean;
  otp: {
    otp: string;
    expires: Date;
  };
  notification: {
    email: boolean;
    inApp: boolean;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
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
      select: false,
    },
    status: {
      type: String,
      default: "ACTIVE",
    },
    twoFAEnabled: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: {
        values: Object.values(UserRoles),
      },
      default: UserRoles.TALENT,
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
      type: new Schema<IUser["otp"]>({
        otp: String,
        expires: Date,
      }),
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const isPasswordValid = await bcrypt.compare(
    candidatePassword,
    this.password
  );
  return isPasswordValid;
};

userSchema.virtual("profile", {
  ref: "Profile",
  foreignField: "user",
  localField: "_id",
  justOne: true,
});

const User = model<IUser, Model<IUser>>("User", userSchema);

export default User;
