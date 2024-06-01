import express from "express";
import validateBody from "../helpers/validateBody.js";
import { registerSchema, loginSchema, verifySchema } from "../models/user.js";
import {
  getCurrent,
  login,
  logout,
  register,
  resendVerifyEmail,
  updateSubscription,
  verifyEmail,
} from "../controllers/authContollers.js";
import authenticate from "../helpers/authenticate.js";
import { uploadAvatar } from "../controllers/userConroller.js";
import uploadFile from "../helpers/uploadFile.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.post("/logout", authenticate, logout);
authRouter.get("/current", authenticate, getCurrent);
authRouter.patch("/", authenticate, updateSubscription);
authRouter.patch(
  "/avatars",
  uploadFile.single("avatar"),
  authenticate,
  uploadAvatar
);
authRouter.get("/verify/:verificationToken", verifyEmail);
authRouter.post("/verfy", validateBody(verifySchema), resendVerifyEmail);

export default authRouter;
