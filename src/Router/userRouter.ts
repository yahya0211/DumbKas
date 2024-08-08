import { Router } from "express";
import { getAllUsers, login, register } from "../Controller/auth";

const userRouter = Router();

userRouter.get("/getAll", getAllUsers);
userRouter.post("/register", register);
userRouter.post("/login", login);

export default userRouter;
