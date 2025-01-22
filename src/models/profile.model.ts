import { Model, model, Schema, Types } from "mongoose";

interface IProfile {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  photo: string;
  user: Types.ObjectId;
  title: string;
  bio: string;
  nationality: string;
  location: string;
  telephone: string;
  fullName: string;
}

const userSchema = new Schema<IProfile, Model<IProfile>>(
  {
    firstName: {
      type: String,
      required: true,
      index: true,
    },
    lastName: String,
    photo: String,
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
      ref: "User",
    },
    telephone: {
      type: String,
      unique: true
    },
    nationality: String,
    title: String,
    bio: String,
    location: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
})

const User = model<IProfile, Model<IProfile>>("User", userSchema);

export default User;
