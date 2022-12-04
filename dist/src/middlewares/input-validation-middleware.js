"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const inputValidationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const customErrorsMessages = [];
        errors.array({ onlyFirstError: true }).forEach((err) => {
            const { value, msg, param, location } = err;
            customErrorsMessages.push({
                message: msg,
                field: param,
            });
        });
        return res.status(400).send({ errorsMessages: customErrorsMessages });
    }
    else {
        next();
    }
};
exports.inputValidationMiddleware = inputValidationMiddleware;
