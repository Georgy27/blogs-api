"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nameValidation = void 0;
const express_validator_1 = require("express-validator");
exports.nameValidation = (0, express_validator_1.body)("name")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 15 })
    .withMessage("name can not be longer than 15 characters");
