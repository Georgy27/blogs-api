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
import { container } from "../composition-root";
import { UsersController } from "../controllers/UsersController";
import { LoginValidation } from "../middlewares/validation/users-middleware/loginValidation";
import { EmailRegistrationValidation } from "../middlewares/validation/users-middleware/emailRegistrationValidation";

export const usersRouter = Router({});
const usersController = container.resolve(UsersController);
const loginValidation = container.resolve(LoginValidation);
const emailRegistrationValidation = container.resolve(
  EmailRegistrationValidation
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
  loginValidation.loginValidation.bind(loginValidation),
  passwordValidation,
  emailRegistrationValidation.emailRegistrationValidation.bind(
    emailRegistrationValidation
  ),
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
