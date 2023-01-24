import { body } from "express-validator";
import { usersQueryRepository } from "../../../composition-root";

export const emailResendingValidation = body("email")
  .isEmail()
  .custom(async (email) => {
    const user = await usersQueryRepository.findByLoginOrEmail(email);
    if (!user) {
      throw new Error("user doesn't exist");
    }
    if (user.emailConfirmation.isConfirmed) {
      throw new Error("user email already confirmed");
    }
    return true;
  });
