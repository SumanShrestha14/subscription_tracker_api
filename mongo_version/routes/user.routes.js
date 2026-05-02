import { Router } from "express";
import usersController from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";
const userRouter = Router();

userRouter.get("/", usersController.getUsers);
userRouter.get("/:id", authorize ,usersController.getUser);
userRouter.post("/", (req, res) => {
  res.send({ message: "POST user" });
});
userRouter.put("/:id", (req, res) => {
  res.send({ message: "UPDATE one user" });
});
userRouter.delete("/:id", (req, res) => {
  res.send({ message: "DELETE one user" });
});

export default userRouter;