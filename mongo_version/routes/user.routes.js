import { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.send({ message: "GET all users" });
});
userRouter.get("/:id", (req, res) => {
  res.send({ message: "GET one user" });
});
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