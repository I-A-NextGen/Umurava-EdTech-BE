import jwt from "jsonwebtoken";
import User from "../../models/userModel";
import { AppError } from "../../utils/errorsUtils";

const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new AppError("fail", 404, "User not found.", true);

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError(
      "fail",
      401,
      "Incorrect password. Please try again.",
      true
    );
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new AppError("error", 500, "JWT secret key is not defined", false);
  }

  const jwtToken = jwt.sign(
    {
      sub: user._id,
      email: user.email,
      role: user.role,
    },
    jwtSecret,
    {
      expiresIn: "2h",
    }
  );
  return jwtToken;
};

export default loginUser;
