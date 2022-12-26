import { body } from "express-validator";
import { usersRepository } from "../../repositories/users-db-repository";

export const emailValidation = body("email")
  .isEmail()
  .custom(async (email) => {
    const isUserWithEmail = await usersRepository.findByLoginOrEmail(email);
    if (isUserWithEmail) {
      throw new Error("user with given email already exist");
    } else {
      return true;
    }
  });
