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
  confirmEmail,
  confirmRecoveryCode,
  emailRegistrationValidation,
  emailResendingValidation,
  jwtAuthMiddleware,
  loginValidation,
  refreshTokenMiddleware,
} from "../composition-root";

export const authRouter = Router({});
const jwtMw = jwtAuthMiddleware.use.bind(jwtAuthMiddleware);
const confirmRecoveryMw = confirmRecoveryCode.use.bind(confirmRecoveryCode);
const confirmEmailMw = confirmEmail.use.bind(confirmEmail);
const refreshTokenMw = refreshTokenMiddleware.use.bind(refreshTokenMiddleware);
const loginValidationMw = loginValidation.use.bind(loginValidation);
const emailRegistrationValidationMw = emailRegistrationValidation.use.bind(
  emailRegistrationValidation
);
const emailResendingValidationMw = emailResendingValidation.use.bind(
  emailResendingValidation
);
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
  loginValidationMw,
  passwordValidation,
  emailRegistrationValidationMw,
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
  confirmEmailMw,
  inputValidationMiddleware,
  morgan("tiny"),
  authController.registrationConfirmation.bind(authController)
);
authRouter.post(
  "/registration-email-resending",
  checkRequests,
  emailResendingValidationMw,
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
  confirmRecoveryMw,
  inputValidationMiddleware,
  authController.newPassword.bind(authController)
);
authRouter.get(
  "/me",
  jwtMw,
  morgan("tiny"),
  authController.me.bind(authController)
);
