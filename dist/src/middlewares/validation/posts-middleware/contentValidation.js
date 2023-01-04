"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentValidation = void 0;
const express_validator_1 = require("express-validator");
exports.contentValidation = (0, express_validator_1.body)("content")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 1000 });
