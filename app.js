import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "node:path";

import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/auth.js";

import "dotenv/config";

import mongoose from "mongoose";

const app = express();

mongoose.set("strictQuery", true);

const { DB_HOST, PORT = 3000 } = process.env;
mongoose
  .connect(DB_HOST)
  .then(() =>
    app.listen(PORT, () => {
      console.log("Database connection successful");
    })
  )
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/avatars", express.static(path.resolve("public/avatars")));

app.use("/api/contacts", contactsRouter);
app.use("/users", authRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});
