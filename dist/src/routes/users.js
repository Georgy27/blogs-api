"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const basic_auth_middleware_1 = require("../middlewares/auth/basic-auth-middleware");
const input_validation_middleware_1 = require("../middlewares/validation/input-validation-middleware");
const sorting_pagination_middleware_1 = require("../middlewares/validation/sorting&pagination-middleware");
const passwordValidation_1 = require("../middlewares/validation/users-middleware/passwordValidation");
const morgan_middleware_1 = require("../middlewares/morgan-middleware");
const composition_root_1 = require("../composition-root");
exports.usersRouter = (0, express_1.Router)({});
const loginValidationMw = composition_root_1.loginValidation.use.bind(composition_root_1.loginValidation);
const emailRegistrationValidationMw = composition_root_1.emailRegistrationValidation.use.bind(composition_root_1.emailRegistrationValidation);
// routes
exports.usersRouter.get("/", basic_auth_middleware_1.basicAuthMiddleware, sorting_pagination_middleware_1.pageSize, sorting_pagination_middleware_1.sortBy, sorting_pagination_middleware_1.pageNumberValidation, (0, morgan_middleware_1.morgan)("tiny"), composition_root_1.usersController.getAllUsers.bind(composition_root_1.usersController));
exports.usersRouter.post("/", basic_auth_middleware_1.basicAuthMiddleware, loginValidationMw, passwordValidation_1.passwordValidation, emailRegistrationValidationMw, input_validation_middleware_1.inputValidationMiddleware, (0, morgan_middleware_1.morgan)("tiny"), composition_root_1.usersController.createUser.bind(composition_root_1.usersController));
exports.usersRouter.delete("/:id", basic_auth_middleware_1.basicAuthMiddleware, (0, morgan_middleware_1.morgan)("tiny"), composition_root_1.usersController.deleteUserById.bind(composition_root_1.usersController));
