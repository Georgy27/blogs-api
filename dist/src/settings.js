"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = void 0;
exports.settings = {
    JWT_SECRET: process.env.JWT_SECRET || "5587",
    JWT_REFRESH_SECRET: process.env.REFRESH_KEY_COOL || "3285932",
};
