import { body } from "express-validator";
import { inject, injectable } from "inversify";
import { UsersQueryRepository } from "../../../repositories/users-db-query-repository";

@injectable()
export class ConfirmRecoveryCode {
  constructor(
    @inject(UsersQueryRepository)
    protected usersQueryRepository: UsersQueryRepository
  ) {}
  confirmRecoveryCode = body("recoveryCode")
    .isString()
    .notEmpty()
    .custom(async (code) => {
      const user =
        await this.usersQueryRepository.findUserByPasswordConfirmationCode(
          code
        );
      if (!user) {
        throw new Error("user doesn't exist");
      }
      if (user.passwordRecovery.recoveryCode !== code) {
        throw new Error("user code does not match");
      }
      if (user.passwordRecovery.expirationDate! < new Date().toISOString()) {
        throw new Error("user code has expired");
      }
      return true;
    });
}
