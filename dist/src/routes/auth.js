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
const express_validator_1 = require("express-validator");
const passwordValidation_1 = require("../middlewares/users-middleware/passwordValidation");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const users_service_1 = require("../domain/users-service");
const jwt_service_1 = require("../application/jwt-service");
const jwt_auth_middleware_1 = require("../middlewares/jwt-auth-middleware");
exports.authRouter = (0, express_1.Router)({});
const loginOrEmailValidation = (0, express_validator_1.body)("loginOrEmail")
    .isString()
    .trim()
    .notEmpty();
exports.authRouter.post("/login", loginOrEmailValidation, passwordValidation_1.passwordValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginOrEmail, password } = req.body;
    const user = yield users_service_1.usersService.checkCredentials(loginOrEmail, password);
    if (!user) {
        return res.sendStatus(401);
    }
    const token = yield jwt_service_1.jwtService.createJWT(user);
    return res.status(200).send(token);
}));
exports.authRouter.get("/me", jwt_auth_middleware_1.jwtAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield req.user;
    return res.status(200).send(user);
}));
