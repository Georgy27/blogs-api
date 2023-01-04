import { Request, Response, Router } from "express";
import { usersService } from "../domain/users-service";
import { CreateUserModel } from "../models/users-model/CreateUserModel";
import { RequestWithBody, RequestWithParams, RequestWithQuery } from "../types";
import { UsersDBViewModel } from "../models/users-model/UsersDBViewModel";
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
import { emailValidation } from "../middlewares/validation/users-middleware/emailValidation";
import { UsersViewModel } from "../models/users-model/UsersViewModel";
import { Pagination } from "../models/pagination.model";
import { morgan } from "../middlewares/morgan-middleware";

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
  emailValidation,
  inputValidationMiddleware,
  morgan("tiny"),
  async (
    req: RequestWithBody<CreateUserModel>,
    res: Response<UsersDBViewModel>
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
