import { User, loginSchema, registerSchema } from "../models/user.js";
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
    const hashedPassword = (await createHashedPassword(password)).result;
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
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
