"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsValidation = void 0;
const express_validator_1 = require("express-validator");
exports.commentsValidation = (0, express_validator_1.body)("content")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 20, max: 300 });
