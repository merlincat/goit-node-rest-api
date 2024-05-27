import { User } from "../models/user.js";
import express from "express";
import * as fs from "node:fs/promises";
import path from "node:path";
import HttpError from "../helpers/HttpError.js";
import Jimp from "jimp";

export const uploadAvatar = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    if (!req.file) {
      return next(HttpError(400, "Avatar is required"));
    }

    const { path: tempPath, filename } = req.file;
    const avatarPath = path.resolve("public/avatars", filename);

    const image = await Jimp.read(tempPath);
    await image.resize(250, 250).writeAsync(avatarPath);
    await fs.unlink(tempPath);

    const avatarURL = `/avatars/${filename}`;
    const updUser = await User.findByIdAndUpdate(
      userId,
      { avatarURL },
      { new: true }
    );

    if (!updUser) {
      return next(HttpError(401, "Not authorized"));
    }

    res.status(200).json({
      avatarURL: updUser.avatarURL,
    });
  } catch (error) {
    next(error);
  }
};
