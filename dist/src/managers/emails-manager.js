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
exports.emailsManager = void 0;
const email_adapter_1 = require("../adapters/email-adapter");
exports.emailsManager = {
    sendEmailConformationMessage(user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Email Manager ${user.emailConfirmation.confirmationCode}`);
            let message = `<h1>Thank for your registration</h1><p>To finish registration please follow the link below: <a href='https://some-front.com/confirm-registration?code=${user.emailConfirmation.confirmationCode}'>complete registration</a> </p>`;
            yield email_adapter_1.emailAdapter.sendEmail(user.accountData.email, message);
        });
    },
};
