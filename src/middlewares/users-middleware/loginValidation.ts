import { body } from "express-validator";
import { blogsQueryRepository } from "../../repositories/blogs-db-query-repository";
import { usersRepository } from "../../repositories/users-db-repository";

export const loginValidation = body("login")
  .isString()
  .trim()
  .notEmpty()
  .isLength({ min: 3, max: 10 })
  .matches("^[a-zA-Z0-9_-]*$")
  .custom(async (login) => {
    console.log(login);
    const isUserWithLogin = await usersRepository.findByLoginOrEmail(login);
    if (isUserWithLogin) {
      throw new Error("user with given login already exist");
    } else {
      return true;
    }
  });
