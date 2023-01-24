import { Router } from "express";
import { basicAuthMiddleware } from "../middlewares/auth/basic-auth-middleware";
import { inputValidationMiddleware } from "../middlewares/validation/input-validation-middleware";
import {
  pageNumberValidation,
  pageSize,
  sortBy,
} from "../middlewares/validation/sorting&pagination-middleware";
import { passwordValidation } from "../middlewares/validation/users-middleware/passwordValidation";
import { morgan } from "../middlewares/morgan-middleware";
import {
  emailRegistrationValidation,
  loginValidation,
  usersController,
} from "../composition-root";

export const usersRouter = Router({});
const loginValidationMw = loginValidation.use.bind(loginValidation);
const emailRegistrationValidationMw = emailRegistrationValidation.use.bind(
  emailRegistrationValidation
);
// routes
usersRouter.get(
  "/",
  basicAuthMiddleware,
  pageSize,
  sortBy,
  pageNumberValidation,
  morgan("tiny"),
  usersController.getAllUsers.bind(usersController)
);
usersRouter.post(
  "/",
  basicAuthMiddleware,
  loginValidationMw,
  passwordValidation,
  emailRegistrationValidationMw,
  inputValidationMiddleware,
  morgan("tiny"),
  usersController.createUser.bind(usersController)
);
usersRouter.delete(
  "/:id",
  basicAuthMiddleware,
  morgan("tiny"),
  usersController.deleteUserById.bind(usersController)
);
