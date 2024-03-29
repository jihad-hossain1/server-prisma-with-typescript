import express, { Application } from "express";
import dotenv from "dotenv";
dotenv.config();

const app: Application = express();

const port: number = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

import homeRoute from "./routes/homeRoute.js";
import userRouter from "./routes/userRoute.js";
import postRouter from "./routes/postRoute.js";

app.use(homeRoute);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

app.listen(port, () => {
  console.log(`connect to server on port ${port}`);
});
