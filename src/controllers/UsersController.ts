import { RequestWithBody, RequestWithParams, RequestWithQuery } from "../types";
import { CreateUserModel, UsersViewModel } from "../models/users-model";
import { Response } from "express";
import { UsersService } from "../domain/users-service";
import { Pagination } from "../models/pagination.model";
import { UsersQueryRepository } from "../repositories/users-db-query-repository";
import { inject, injectable } from "inversify";

@injectable()
export class UsersController {
  constructor(
    @inject(UsersService) protected usersService: UsersService,
    @inject(UsersQueryRepository)
    protected usersQueryRepository: UsersQueryRepository
  ) {}
  async createUser(
    req: RequestWithBody<CreateUserModel>,
    res: Response<UsersViewModel>
  ) {
    console.log("im in controller");
    const { login, password, email } = req.body;
    const newUser = await this.usersService.createUserByAdmin(
      login,
      password,
      email
    );
    return res.status(201).send(newUser);
  }
  async getAllUsers(
    req: RequestWithQuery<any>,
    res: Response<Pagination<UsersViewModel>>
  ) {
    const { searchLoginTerm, searchEmailTerm, sortBy, sortDirection } =
      req.query;
    const { pageSize, pageNumber } = req.query;
    const allUsers = await this.usersQueryRepository.findUsers(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm
    );
    res.status(200).send(allUsers);
  }

  async deleteUserById(req: RequestWithParams<{ id: string }>, res: Response) {
    const userId = req.params.id;

    const getDeletedUser = await this.usersService.deleteUser(userId);
    if (!getDeletedUser) {
      return res.sendStatus(404);
    }
    return res.sendStatus(204);
  }
}
