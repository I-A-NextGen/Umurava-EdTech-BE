import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Joi from "joi";
import User from "../models/user.model";
import Profile from "../models/profile.model";

const registerSchema = Joi.object({
  role: Joi.string().valid("talent", "client").required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { role, firstName, lastName, email, password } = req.body;

  const { error } = registerSchema.validate({ role, firstName, lastName, email, password });

  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      status: true,
      role,
    });

    await newUser.save();

    const newProfile = new Profile({
      firstName,
      lastName,
      user: newUser._id,
      
    });

    await newProfile.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
