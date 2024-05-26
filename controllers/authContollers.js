import {
  User,
  loginSchema,
  registerSchema,
  subscriptionSchema,
} from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import createHashedPassword from "../helpers/createHashPassword.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";

const { SECRET_KEY } = process.env;
export const register = async (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return next(HttpError(400));
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return next(HttpError(409, "Email in use"));
    }
    const hashedPassword = await createHashedPassword(password);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    res.status(201).json({
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return next(HttpError(400));
  }
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(HttpError(401, "Email or password is wrong"));
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return next(HttpError(401, "Email or password is wrong"));
    }
    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const getCurrent = async (req, res, next) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};
export const logout = async (req, res, next) => {
  const { _id } = req.user;
  try {
    await User.findByIdAndUpdate(_id, { token: null });
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  const { error } = subscriptionSchema.validate(req.body);
  if (error) {
    return next(HttpError(400, "Invalid subscription value"));
  }

  try {
    const { _id } = req.user;
    const { subscription } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { subscription },
      { new: true }
    );
    if (!updatedUser) {
      return next(HttpError(404, "User not found"));
    }
    res.status(200).json({
      email: updatedUser.email,
      subscription: updatedUser.subscription,
    });
  } catch (error) {
    next(error);
  }
};
