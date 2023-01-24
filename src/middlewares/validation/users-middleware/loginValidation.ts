import { body } from "express-validator";
import { UsersQueryRepository } from "../../../repositories/users-db-query-repository";

export class LoginValidation {
  constructor(protected usersQueryRepository: UsersQueryRepository) {}
  use() {
    body("login")
      .isString()
      .trim()
      .notEmpty()
      .isLength({ min: 3, max: 10 })
      .matches("^[a-zA-Z0-9_-]*$")
      .custom(async (login) => {
        const isUserWithLogin =
          await this.usersQueryRepository.findByLoginOrEmail(login);
        if (isUserWithLogin) {
          throw new Error("user with given login already exist");
        } else {
          return true;
        }
      });
  }
}
