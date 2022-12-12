"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.descriptionValidation = void 0;
const express_validator_1 = require("express-validator");
exports.descriptionValidation = (0, express_validator_1.body)("description")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 500 });
