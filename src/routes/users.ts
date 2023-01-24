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
import { usersController } from "../composition-root";
import { emailRegistrationValidation } from "../middlewares/validation/users-middleware/emailRegistrationValidation";
import { loginValidation } from "../middlewares/validation/users-middleware/loginValidation";

export const usersRouter = Router({});

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
  loginValidation,
  passwordValidation,
  emailRegistrationValidation,
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
