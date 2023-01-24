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
exports.EmailsManager = void 0;
class EmailsManager {
    constructor(emailAdapter) {
        this.emailAdapter = emailAdapter;
    }
    sendEmailConformationMessage(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let message = `<h1>Thank for your registration</h1><p>To finish registration please follow the link below: <a href='https://some-front.com/confirm-registration?code=${user.emailConfirmation.confirmationCode}'>complete registration</a> </p>`;
            yield this.emailAdapter.sendEmail(user.accountData.email, message);
        });
    }
    sendPasswordRecoveryCode(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let message = `<h1>Thank for your registration</h1><p>To finish registration please follow the link below: <a href='https://some-front.com/password-recovery?recoveryCode=${user.passwordRecovery.recoveryCode}'>complete registration</a></p>`;
            yield this.emailAdapter.sendEmail(user.accountData.email, message);
        });
    }
}
exports.EmailsManager = EmailsManager;
