import { User } from "../models/user.js";
import express from "express";
import * as fs from "node:fs/promises";
import path from "node:path";
import HttpError from "../helpers/HttpError.js";

export const uploadAvatar = async (req, res, next) => {
  try {
    await fs.rename(
      req.file.path,
      path.resolve("public/avatars", req.file.filename)
    );
    console.log(req.file);
    const updUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: req.file.path },
      { new: true }
    );
    if (updUser === null) {
      return next(HttpError(401, "Not authorized"));
    }
    res.status(200).json({
      avatarURL: updUser.avatarURL,
    });
  } catch (error) {
    next(error);
  }
};
