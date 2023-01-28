"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
const email_adapter_1 = require("../adapters/email-adapter");
const inversify_1 = require("inversify");
let EmailsManager = class EmailsManager {
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
};
EmailsManager = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(email_adapter_1.EmailAdapter)),
    __metadata("design:paramtypes", [email_adapter_1.EmailAdapter])
], EmailsManager);
exports.EmailsManager = EmailsManager;
