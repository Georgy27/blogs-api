import { body } from "express-validator";
import { inject, injectable } from "inversify";
import { UsersQueryRepository } from "../../../repositories/users-db-query-repository";

@injectable()
export class EmailResendingValidation {
  constructor(
    @inject(UsersQueryRepository)
    protected usersQueryRepository: UsersQueryRepository
  ) {}
  emailResendingValidation = body("email")
    .isEmail()
    .custom(async (email) => {
      const user = await this.usersQueryRepository.findByLoginOrEmail(email);
      if (!user) {
        throw new Error("user doesn't exist");
      }
      if (user.emailConfirmation.isConfirmed) {
        throw new Error("user email already confirmed");
      }
      return true;
    });
}
