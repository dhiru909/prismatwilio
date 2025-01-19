import { Router } from "express";
import {signup, signupVerify} from "../controller/userController";

const userRouter = Router();

userRouter.post("/signup",signup)
userRouter.post("/signup/verify",signupVerify);
export default userRouter;