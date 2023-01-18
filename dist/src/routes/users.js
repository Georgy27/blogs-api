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
exports.usersRouter = void 0;
const express_1 = require("express");
const users_service_1 = require("../domain/users-service");
const basic_auth_middleware_1 = require("../middlewares/auth/basic-auth-middleware");
const input_validation_middleware_1 = require("../middlewares/validation/input-validation-middleware");
const users_db_query_repository_1 = require("../repositories/users-db-query-repository");
const sorting_pagination_middleware_1 = require("../middlewares/validation/sorting&pagination-middleware");
const loginValidation_1 = require("../middlewares/validation/users-middleware/loginValidation");
const passwordValidation_1 = require("../middlewares/validation/users-middleware/passwordValidation");
const morgan_middleware_1 = require("../middlewares/morgan-middleware");
const emailRegistrationValidation_1 = require("../middlewares/validation/users-middleware/emailRegistrationValidation");
exports.usersRouter = (0, express_1.Router)({});
// routes
exports.usersRouter.get("/", basic_auth_middleware_1.basicAuthMiddleware, sorting_pagination_middleware_1.pageSize, sorting_pagination_middleware_1.sortBy, sorting_pagination_middleware_1.pageNumberValidation, (0, morgan_middleware_1.morgan)("tiny"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchLoginTerm, searchEmailTerm, sortBy, sortDirection } = req.query;
    const { pageSize, pageNumber } = req.query;
    const allUsers = yield users_db_query_repository_1.usersQueryRepository.findUsers(pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm);
    res.status(200).send(allUsers);
}));
exports.usersRouter.post("/", basic_auth_middleware_1.basicAuthMiddleware, loginValidation_1.loginValidation, passwordValidation_1.passwordValidation, emailRegistrationValidation_1.emailRegistrationValidation, input_validation_middleware_1.inputValidationMiddleware, (0, morgan_middleware_1.morgan)("tiny"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, password, email } = req.body;
    const newUser = yield users_service_1.usersService.createUserByAdmin(login, password, email);
    return res.status(201).send(newUser);
}));
exports.usersRouter.delete("/:id", basic_auth_middleware_1.basicAuthMiddleware, (0, morgan_middleware_1.morgan)("tiny"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const getDeletedUser = yield users_service_1.usersService.deleteUser(userId);
    if (!getDeletedUser) {
        return res.sendStatus(404);
    }
    return res.sendStatus(204);
}));
