import bcrypt from "bcryptjs";
import User, { UserRoles } from "../../models/userModel";
import { AppError } from "../../utils/errorsUtils";
import Profile from "../../models/profileModel";

interface IUserInput {
  role: UserRoles;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const registerUser = async ({
  role,
  firstName,
  lastName,
  email,
  password,
}: IUserInput) => {
  let userId;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError(
        "fail",
        409,
        "Email address is already registered.",
        true
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    userId = newUser._id;

    const newProfile = new Profile({
      firstName,
      lastName,
      user: newUser._id,
    });

    await newProfile.save();

    return { ...newUser.toObject(), profile: newProfile };
  } catch (error) {
    await User.findByIdAndDelete(userId);

    throw error;
  }
};

export default registerUser;
