import { body } from "express-validator";
import { inject, injectable } from "inversify";
import { UsersQueryRepository } from "../../../repositories/users-db-query-repository";

@injectable()
export class EmailRegistrationValidation {
  constructor(
    @inject(UsersQueryRepository)
    protected usersQueryRepository: UsersQueryRepository
  ) {}
  emailRegistrationValidation = body("email")
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
