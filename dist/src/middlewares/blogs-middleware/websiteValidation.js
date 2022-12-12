"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.websiteValidation = void 0;
const express_validator_1 = require("express-validator");
exports.websiteValidation = (0, express_validator_1.body)("websiteUrl")
    .isLength({ max: 100 })
    .matches("^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$");
