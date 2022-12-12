"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortBy = exports.pageSize = exports.pageNumberValidation = void 0;
const express_validator_1 = require("express-validator");
exports.pageNumberValidation = (0, express_validator_1.query)("pageNumber").toInt().default(1);
exports.pageSize = (0, express_validator_1.query)("pageSize").toInt().default(10);
exports.sortBy = (0, express_validator_1.query)("sortBy").default("createdAt");
