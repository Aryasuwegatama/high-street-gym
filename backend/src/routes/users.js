import { Router } from "express";
import * as UserController from "../controllers/users.js";
import controlAccess from "../middleware/controlAccess.js";
import * as InputValidation from "../middleware/validationRules.js";
import { validationResultHandler } from "../middleware/validationResultHandler.js";

const userRouter = Router();

userRouter.post(
  "/signup",
  InputValidation.validateSignUp,
  validationResultHandler,
  UserController.signUp
);
userRouter.post(
  "/signin",
  InputValidation.validateSignIn,
  validationResultHandler,
  UserController.signIn
);
userRouter.post(
  "/signout",
  InputValidation.validateAuthToken,
  validationResultHandler,
  UserController.signOut
);

userRouter.get("/", controlAccess(["admin"]), UserController.getAll);

userRouter.get(
  "/auth",
  InputValidation.validateAuthToken,
  validationResultHandler,
  controlAccess(["member", "trainer", "admin"]),
  UserController.getByAuthToken
);
userRouter.get(
  "/:id",
  InputValidation.validateGetById,
  validationResultHandler,
  // enforce user to access only their own data by set the values true
  // in middleware only admin can access other user data
  controlAccess(["member", "trainer", "admin"], true),
  UserController.getById
);

userRouter.get(
  "/email/:email",
  InputValidation.validateGetUserByEmail,
  validationResultHandler,
  controlAccess(["admin"]),
  UserController.getByEmail
);

userRouter.post(
  "/create-user",
  InputValidation.validateCreateUser,
  validationResultHandler,
  controlAccess(["admin"]),
  UserController.createUser
);
userRouter.patch(
  "/update-my-account/:id",
  InputValidation.validateUpdateUser,
  validationResultHandler,
  // enforce user to access only their own data by set the values true
  // in middleware only admin can access other user data
  controlAccess(["member", "trainer", "admin"], true),
  UserController.updateUser
);
// update user for admin
userRouter.patch(
  "/update-user/:id",
  InputValidation.validateUpdateUser,
  validationResultHandler,
  controlAccess(["admin"]),
  UserController.updateUser
);
userRouter.delete(
  "/delete-user/:id",
  InputValidation.validateGetById,
  validationResultHandler,
  controlAccess(["admin"]),
  UserController.deleteUser
);

export default userRouter;
