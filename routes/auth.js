import express from "express";
import validateBody from "../helpers/validateBody.js";
import { registerSchema, loginSchema } from "../models/user.js";
import { login, register } from "../controllers/authContollers.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/login", validateBody(loginSchema), login);

export default authRouter;
