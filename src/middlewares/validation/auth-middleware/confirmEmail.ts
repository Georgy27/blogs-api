import { body } from "express-validator";
import { usersQueryRepository } from "../../../composition-root";

export const confirmEmail = body("code")
  .isString()
  .notEmpty()
  .custom(async (code) => {
    const user = await usersQueryRepository.findUserByEmailConfirmationCode(
      code
    );
    if (!user) {
      throw new Error("user doesn't exist");
    }
    if (user.emailConfirmation.isConfirmed) {
      throw new Error("user email already confirmed");
    }
    if (user.emailConfirmation.confirmationCode !== code) {
      throw new Error("user code does not match");
    }
    if (user.emailConfirmation.expirationDate < new Date().toISOString()) {
      throw new Error("user code has expired");
    }
    return true;
  });
