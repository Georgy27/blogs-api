"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailRegistrationValidation = void 0;
const express_validator_1 = require("express-validator");
const composition_root_1 = require("../../../composition-root");
exports.emailRegistrationValidation = (0, express_validator_1.body)("email")
    .isEmail()
    .custom((email) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("in custom");
    const isUserWithEmail = yield composition_root_1.usersQueryRepository.findByLoginOrEmail(email);
    if (isUserWithEmail) {
        throw new Error("user with given email already exist");
    }
    else {
        return true;
    }
}));
