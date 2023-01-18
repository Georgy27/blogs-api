import { Request, Response, Router } from "express";
import { usersService } from "../domain/users-service";
import { RequestWithBody, RequestWithParams, RequestWithQuery } from "../types";
import { basicAuthMiddleware } from "../middlewares/auth/basic-auth-middleware";
import { inputValidationMiddleware } from "../middlewares/validation/input-validation-middleware";
import { usersQueryRepository } from "../repositories/users-db-query-repository";
import {
  pageNumberValidation,
  pageSize,
  sortBy,
} from "../middlewares/validation/sorting&pagination-middleware";
import { loginValidation } from "../middlewares/validation/users-middleware/loginValidation";
import { passwordValidation } from "../middlewares/validation/users-middleware/passwordValidation";
import { Pagination } from "../models/pagination.model";
import { morgan } from "../middlewares/morgan-middleware";
import { CreateUserModel, UsersViewModel } from "../models/users-model";
import { emailRegistrationValidation } from "../middlewares/validation/users-middleware/emailRegistrationValidation";

export const usersRouter = Router({});

// routes
usersRouter.get(
  "/",
  basicAuthMiddleware,
  pageSize,
  sortBy,
  pageNumberValidation,
  morgan("tiny"),
  async (
    req: RequestWithQuery<any>,
    res: Response<Pagination<UsersViewModel>>
  ) => {
    const { searchLoginTerm, searchEmailTerm, sortBy, sortDirection } =
      req.query;
    const { pageSize, pageNumber } = req.query;
    const allUsers = await usersQueryRepository.findUsers(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm
    );
    res.status(200).send(allUsers);
  }
);

usersRouter.post(
  "/",
  basicAuthMiddleware,
  loginValidation,
  passwordValidation,
  emailRegistrationValidation,
  inputValidationMiddleware,
  morgan("tiny"),
  async (
    req: RequestWithBody<CreateUserModel>,
    res: Response<UsersViewModel>
  ) => {
    const { login, password, email } = req.body;
    const newUser = await usersService.createUserByAdmin(
      login,
      password,
      email
    );
    return res.status(201).send(newUser);
  }
);

usersRouter.delete(
  "/:id",
  basicAuthMiddleware,
  morgan("tiny"),
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const userId = req.params.id;

    const getDeletedUser = await usersService.deleteUser(userId);
    if (!getDeletedUser) {
      return res.sendStatus(404);
    }
    return res.sendStatus(204);
  }
);
