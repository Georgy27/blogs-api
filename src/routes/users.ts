import { Request, Response, Router } from "express";
import { usersService } from "../domain/users-service";
import { CreateUserModel } from "../models/users-model/CreateUserModel";
import { RequestWithBody, RequestWithQuery } from "../types";
import { UsersDBViewModel } from "../models/users-model/UsersDBViewModel";
import { body } from "express-validator";
import { basicAuthMiddleware } from "../middlewares/basic-auth-middleware";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { QueryUserModel } from "../models/users-model/QueryUserModel";
import { UsersViewModel } from "../models/users-model/UsersViewModel";
import { usersQueryRepository } from "../repositories/users-db-query-repository";
import {
  pageNumberValidation,
  pageSize,
  sortBy,
} from "../middlewares/sorting&pagination-middleware";
import { loginValidation } from "../middlewares/users-middleware/loginValidation";
import { passwordValidation } from "../middlewares/users-middleware/passwordValidation";
import { emailValidation } from "../middlewares/users-middleware/emailValidation";

export const usersRouter = Router({});

// routes
usersRouter.get(
  "/",
  pageSize,
  sortBy,
  pageNumberValidation,
  async (
    req: RequestWithQuery<QueryUserModel>,
    res: Response<UsersViewModel>
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

usersRouter.delete("/:id", async (req: Request, res: Response) => {});
