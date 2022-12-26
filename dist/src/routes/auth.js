"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const passwordValidation_1 = require("../middlewares/users-middleware/passwordValidation");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const users_service_1 = require("../domain/users-service");
const jwt_service_1 = require("../application/jwt-service");
const jwt_auth_middleware_1 = require("../middlewares/jwt-auth-middleware");
const loginValidation_1 = require("../middlewares/users-middleware/loginValidation");
const emailValidation_1 = require("../middlewares/users-middleware/emailValidation");
const loginOrEmailValidation_1 = require("../middlewares/auth-middleware/loginOrEmailValidation");
const morgan_middleware_1 = require("../middlewares/morgan-middleware");
const auth_service_1 = require("../domain/auth-service");
const confirmEmail_1 = require("../middlewares/auth-middleware/confirmEmail");
const emailResendingValidation_1 = require("../middlewares/auth-middleware/emailResendingValidation");
exports.authRouter = (0, express_1.Router)({});
exports.authRouter.post("/login", loginOrEmailValidation_1.loginOrEmailValidation, passwordValidation_1.passwordValidation, input_validation_middleware_1.inputValidationMiddleware, (0, morgan_middleware_1.morgan)("tiny"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginOrEmail, password } = req.body;
    const user = yield users_service_1.usersService.checkCredentials(loginOrEmail, password);
    if (!user) {
        return res.sendStatus(401);
    }
    const token = yield jwt_service_1.jwtService.createJWT(user);
    return res.status(200).send(token);
}));
exports.authRouter.post("/registration", loginValidation_1.loginValidation, passwordValidation_1.passwordValidation, emailValidation_1.emailValidation, input_validation_middleware_1.inputValidationMiddleware, (0, morgan_middleware_1.morgan)("tiny"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, password, email } = req.body;
    const newUser = yield users_service_1.usersService.createUser(login, password, email);
    if (!newUser)
        return res.sendStatus(400);
    return res.sendStatus(204);
}));
exports.authRouter.post("/registration-confirmation", confirmEmail_1.confirmEmail, input_validation_middleware_1.inputValidationMiddleware, (0, morgan_middleware_1.morgan)("tiny"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.body.code;
    const isConfirmedEmail = yield auth_service_1.authService.confirmEmail(code);
    if (!isConfirmedEmail) {
        return res.sendStatus(400);
    }
    return res.sendStatus(204);
}));
exports.authRouter.post("/registration-email-resending", emailResendingValidation_1.emailResendingValidation, input_validation_middleware_1.inputValidationMiddleware, (0, morgan_middleware_1.morgan)("tiny"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userEmail = req.body.email;
    const result = yield auth_service_1.authService.resendEmail(userEmail);
    // if email could not be send (can be 500 error)
    if (!result)
        return res.sendStatus(400);
    return res.sendStatus(204);
}));
exports.authRouter.get("/me", jwt_auth_middleware_1.jwtAuthMiddleware, (0, morgan_middleware_1.morgan)("tiny"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield req.user;
    return res.status(200).send(user);
}));
