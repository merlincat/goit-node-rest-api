import express from "express";
import validateBody from "../helpers/validateBody.js";
import { registerSchema, loginSchema } from "../models/user.js";
import {
  getCurrent,
  login,
  logout,
  register,
  updateSubscription,
} from "../controllers/authContollers.js";
import authenticate from "../helpers/authenticate.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.post("/logout", authenticate, logout);
authRouter.get("/current", authenticate, getCurrent);
authRouter.patch("/", authenticate, updateSubscription);

export default authRouter;
