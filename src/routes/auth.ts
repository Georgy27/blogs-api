import { Router } from "express";
import {
  newPasswordValidation,
  passwordValidation,
} from "../middlewares/validation/users-middleware/passwordValidation";
import { inputValidationMiddleware } from "../middlewares/validation/input-validation-middleware";
import { loginOrEmailValidation } from "../middlewares/validation/auth-middleware/loginOrEmailValidation";
import { morgan } from "../middlewares/morgan-middleware";
import { checkRequests } from "../middlewares/auth/checkRequests-middleware";
import { emailValidation } from "../middlewares/validation/users-middleware/emailValidation";
import {
  authController,
  jwtAuthMiddleware,
  refreshTokenMiddleware,
} from "../composition-root";
import { emailRegistrationValidation } from "../middlewares/validation/users-middleware/emailRegistrationValidation";
import { loginValidation } from "../middlewares/validation/users-middleware/loginValidation";
import { confirmEmail } from "../middlewares/validation/auth-middleware/confirmEmail";
import { emailResendingValidation } from "../middlewares/validation/auth-middleware/emailResendingValidation";
import { confirmRecoveryCode } from "../middlewares/validation/auth-middleware/recoveryCodeValidation";

export const authRouter = Router({});
const jwtMw = jwtAuthMiddleware.use.bind(jwtAuthMiddleware);
const refreshTokenMw = refreshTokenMiddleware.use.bind(refreshTokenMiddleware);

authRouter.post(
  "/login",
  checkRequests,
  loginOrEmailValidation,
  passwordValidation,
  inputValidationMiddleware,
  morgan("tiny"),
  authController.login.bind(authController)
);
authRouter.post(
  "/registration",
  checkRequests,
  loginValidation,
  passwordValidation,
  emailRegistrationValidation,
  inputValidationMiddleware,
  morgan("tiny"),
  authController.register.bind(authController)
);
authRouter.post(
  "/refresh-token",
  refreshTokenMw,
  authController.refreshToken.bind(authController)
);
authRouter.post(
  "/logout",
  refreshTokenMw,
  morgan("tiny"),
  authController.logout.bind(authController)
);
authRouter.post(
  "/registration-confirmation",
  checkRequests,
  confirmEmail,
  inputValidationMiddleware,
  morgan("tiny"),
  authController.registrationConfirmation.bind(authController)
);
authRouter.post(
  "/registration-email-resending",
  checkRequests,
  emailResendingValidation,
  inputValidationMiddleware,
  morgan("tiny"),
  authController.registrationEmailResending.bind(authController)
);
authRouter.post(
  "/password-recovery",
  checkRequests,
  emailValidation,
  inputValidationMiddleware,
  authController.passwordRecovery.bind(authController)
);
authRouter.post(
  "/new-password",
  checkRequests,
  newPasswordValidation,
  confirmRecoveryCode,
  inputValidationMiddleware,
  authController.newPassword.bind(authController)
);
authRouter.get(
  "/me",
  jwtMw,
  morgan("tiny"),
  authController.me.bind(authController)
);
