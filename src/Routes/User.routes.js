import express from "express";
import UserController from "../controller/User.controller.js";
import jwtAuth from "../middlewares/jwt.middleware.js";

const UserRouter = express.Router();

const userController = new UserController();

//Route to register a new user
UserRouter.post("/register", (req, res, next) =>
  userController.addUser(req, res, next)
);

//Route to signin a user
UserRouter.post("/login", (req, res, next) =>
  userController.login(req, res, next)
);

//route to signout a user
UserRouter.get("/signout", jwtAuth, (req, res, next) =>
  userController.signout(req, res, next)
);

export default UserRouter;
