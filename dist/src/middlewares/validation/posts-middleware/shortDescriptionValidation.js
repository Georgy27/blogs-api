"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortDescriptionValidation = void 0;
const express_validator_1 = require("express-validator");
exports.shortDescriptionValidation = (0, express_validator_1.body)("shortDescription")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 100 });
