"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPasswordValidation = exports.passwordValidation = void 0;
const express_validator_1 = require("express-validator");
exports.passwordValidation = (0, express_validator_1.body)("password")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 6, max: 20 })
    .withMessage("password should be between 6 and 20 characters");
exports.newPasswordValidation = (0, express_validator_1.body)("newPassword")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 6, max: 20 })
    .withMessage("password should be between 6 and 20 characters");
