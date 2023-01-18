"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailValidation = void 0;
const express_validator_1 = require("express-validator");
exports.emailValidation = (0, express_validator_1.body)("email")
    .isEmail()
    .notEmpty()
    .withMessage("invalid email");
