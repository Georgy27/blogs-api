import { body } from "express-validator";
import { UsersQueryRepository } from "../../../repositories/users-db-query-repository";

export class EmailRegistrationValidation {
  constructor(protected usersQueryRepository: UsersQueryRepository) {}
  use() {
    body("email")
      .isEmail()
      .custom(async (email) => {
        const isUserWithEmail =
          await this.usersQueryRepository.findByLoginOrEmail(email);
        if (isUserWithEmail) {
          throw new Error("user with given email already exist");
        } else {
          return true;
        }
      });
  }
}
