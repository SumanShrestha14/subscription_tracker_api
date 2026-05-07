import { Router } from "express";
import usersController from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";
const userRouter = Router();

userRouter.get("/", authorize, usersController.getUsers);
userRouter.get("/:id", authorize ,usersController.getUser);

export default userRouter;