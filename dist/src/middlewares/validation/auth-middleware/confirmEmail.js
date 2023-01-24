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
exports.ConfirmEmail = void 0;
const express_validator_1 = require("express-validator");
class ConfirmEmail {
    constructor(usersQueryRepository) {
        this.usersQueryRepository = usersQueryRepository;
    }
    use() {
        (0, express_validator_1.body)("code")
            .isString()
            .notEmpty()
            .custom((code) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersQueryRepository.findUserByEmailConfirmationCode(code);
            if (!user) {
                throw new Error("user doesn't exist");
            }
            if (user.emailConfirmation.isConfirmed) {
                throw new Error("user email already confirmed");
            }
            if (user.emailConfirmation.confirmationCode !== code) {
                throw new Error("user code does not match");
            }
            if (user.emailConfirmation.expirationDate < new Date().toISOString()) {
                throw new Error("user code has expired");
            }
            return true;
        }));
    }
}
exports.ConfirmEmail = ConfirmEmail;
// export const confirmEmail = body("code")
//   .isString()
//   .notEmpty()
//   .custom(async (code) => {
//     const user = await usersQueryRepository.findUserByEmailConfirmationCode(
//       code
//     );
//     if (!user) {
//       throw new Error("user doesn't exist");
//     }
//     if (user.emailConfirmation.isConfirmed) {
//       throw new Error("user email already confirmed");
//     }
//     if (user.emailConfirmation.confirmationCode !== code) {
//       throw new Error("user code does not match");
//     }
//     if (user.emailConfirmation.expirationDate < new Date().toISOString()) {
//       throw new Error("user code has expired");
//     }
//     return true;
//   });
