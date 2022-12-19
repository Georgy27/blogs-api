import { Request, Response, Router } from "express";
import { usersService } from "../domain/users-service";
import { CreateUserModel } from "../models/users-model/CreateUserModel";
import { RequestWithBody, RequestWithParams, RequestWithQuery } from "../types";
import { UsersDBViewModel } from "../models/users-model/UsersDBViewModel";
import { basicAuthMiddleware } from "../middlewares/basic-auth-middleware";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { usersQueryRepository } from "../repositories/users-db-query-repository";
import {
  pageNumberValidation,
  pageSize,
  sortBy,
} from "../middlewares/sorting&pagination-middleware";
import { loginValidation } from "../middlewares/users-middleware/loginValidation";
import { passwordValidation } from "../middlewares/users-middleware/passwordValidation";
import { emailValidation } from "../middlewares/users-middleware/emailValidation";
import { UsersViewModel } from "../models/users-model/UsersViewModel";

export const usersRouter = Router({});

// routes
usersRouter.get(
  "/",
  basicAuthMiddleware,
  pageSize,
  sortBy,
  pageNumberValidation,

  async (req: RequestWithQuery<any>, res: Response<UsersViewModel>) => {
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
  async (
    req: RequestWithBody<CreateUserModel>,
    res: Response<UsersDBViewModel>
  ) => {
    const { login, password, email } = req.body;
    const newUser = await usersService.createUser(login, password, email);
    return res.status(201).send(newUser);
  }
);

usersRouter.delete(
  "/:id",
  basicAuthMiddleware,
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const userId = req.params.id;

    const getDeletedUser = await usersService.deleteUser(userId);
    if (!getDeletedUser) {
      return res.sendStatus(404);
    }
    return res.sendStatus(204);
  }
);
