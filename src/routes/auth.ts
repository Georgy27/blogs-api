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

import { container } from "../composition-root";
import { AuthController } from "../controllers/AuthController";
import { JwtAuthMiddleware } from "../middlewares/auth/jwt-auth-middleware";
import { RefreshTokenMiddleware } from "../middlewares/auth/refresh-token-middleware";
import { ConfirmEmail } from "../middlewares/validation/auth-middleware/confirmEmail";
import { EmailResendingValidation } from "../middlewares/validation/auth-middleware/emailResendingValidation";
import { ConfirmRecoveryCode } from "../middlewares/validation/auth-middleware/recoveryCodeValidation";
import { LoginValidation } from "../middlewares/validation/users-middleware/loginValidation";
import { EmailRegistrationValidation } from "../middlewares/validation/users-middleware/emailRegistrationValidation";

export const authRouter = Router({});

const authController = container.resolve(AuthController);
const jwtMw = container.resolve(JwtAuthMiddleware);
const refreshTokenMw = container.resolve(RefreshTokenMiddleware);
const confirmEmail = container.resolve(ConfirmEmail);
const emailResendingValidation = container.resolve(EmailResendingValidation);
const confirmRecoveryCode = container.resolve(ConfirmRecoveryCode);
const loginValidation = container.resolve(LoginValidation);
const emailRegistrationValidation = container.resolve(
  EmailRegistrationValidation
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
  loginValidation.loginValidation.bind(loginValidation),
  passwordValidation,
  emailRegistrationValidation.emailRegistrationValidation.bind(
    emailRegistrationValidation
  ),
  inputValidationMiddleware,
  morgan("tiny"),
  authController.register.bind(authController)
);
authRouter.post(
  "/refresh-token",
  refreshTokenMw.use.bind(refreshTokenMw),
  authController.refreshToken.bind(authController)
);
authRouter.post(
  "/logout",
  refreshTokenMw.use.bind(refreshTokenMw),
  morgan("tiny"),
  authController.logout.bind(authController)
);
authRouter.post(
  "/registration-confirmation",
  checkRequests,
  confirmEmail.confirmEmail.bind(confirmEmail),
  inputValidationMiddleware,
  morgan("tiny"),
  authController.registrationConfirmation.bind(authController)
);
authRouter.post(
  "/registration-email-resending",
  checkRequests,
  emailResendingValidation.emailResendingValidation.bind(
    emailResendingValidation
  ),
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
  confirmRecoveryCode.confirmRecoveryCode.bind(confirmRecoveryCode),
  inputValidationMiddleware,
  authController.newPassword.bind(authController)
);
authRouter.get(
  "/me",
  jwtMw.use.bind(jwtMw),
  morgan("tiny"),
  authController.me.bind(authController)
);
