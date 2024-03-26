import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = Number(process.env.PORT) || 3000;
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
//# sourceMappingURL=index.js.map