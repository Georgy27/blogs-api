import { body } from "express-validator";
import { usersQueryRepository } from "../../../composition-root";

export const emailRegistrationValidation = body("email")
  .isEmail()
  .custom(async (email) => {
    console.log("in custom");
    const isUserWithEmail = await usersQueryRepository.findByLoginOrEmail(
      email
    );
    if (isUserWithEmail) {
      throw new Error("user with given email already exist");
    } else {
      return true;
    }
  });
