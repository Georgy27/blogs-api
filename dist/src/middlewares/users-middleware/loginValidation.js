"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = void 0;
const express_validator_1 = require("express-validator");
exports.loginValidation = (0, express_validator_1.body)("login")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 3, max: 10 })
    .matches("^[a-zA-Z0-9_-]*$")
    .withMessage("login should be between 3 and 10 characters");
