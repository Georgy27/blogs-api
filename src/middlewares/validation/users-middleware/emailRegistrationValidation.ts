import { body } from "express-validator";
import { usersQueryRepository } from "../../../repositories/users-db-query-repository";

export const emailRegistrationValidation = body("email")
  .isEmail()
  .custom(async (email) => {
    const isUserWithEmail = await usersQueryRepository.findByLoginOrEmail(
      email
    );
    if (isUserWithEmail) {
      throw new Error("user with given email already exist");
    } else {
      return true;
    }
  });
