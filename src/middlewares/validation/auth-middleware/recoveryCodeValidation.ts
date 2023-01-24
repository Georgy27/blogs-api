import { body } from "express-validator";
import { usersQueryRepository } from "../../../composition-root";

export const confirmRecoveryCode = body("recoveryCode")
  .isString()
  .notEmpty()
  .custom(async (code) => {
    const user = await usersQueryRepository.findUserByPasswordConfirmationCode(
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
