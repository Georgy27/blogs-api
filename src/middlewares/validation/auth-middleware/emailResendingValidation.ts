import { body } from "express-validator";
import { UsersQueryRepository } from "../../../repositories/users-db-query-repository";

export class EmailResendingValidation {
  constructor(protected usersQueryRepository: UsersQueryRepository) {}
  use() {
    body("email")
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
}
