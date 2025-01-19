import express from "express";
import userRouter from "./router/user";
import errorHandler from "./utils/errorHandler";
import dotenv from 'dotenv'

dotenv.config()
const app = express();
app.use(express.json());
app.use(errorHandler);
app.use("/api/v1/user", userRouter);
app.listen(3000);
console.log("listening on port 3000");
