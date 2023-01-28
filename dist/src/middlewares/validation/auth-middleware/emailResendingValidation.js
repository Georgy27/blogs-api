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
exports.EmailResendingValidation = void 0;
const express_validator_1 = require("express-validator");
const inversify_1 = require("inversify");
const users_db_query_repository_1 = require("../../../repositories/users-db-query-repository");
let EmailResendingValidation = class EmailResendingValidation {
    constructor(usersQueryRepository) {
        this.usersQueryRepository = usersQueryRepository;
        this.emailResendingValidation = (0, express_validator_1.body)("email")
            .isEmail()
            .custom((email) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersQueryRepository.findByLoginOrEmail(email);
            if (!user) {
                throw new Error("user doesn't exist");
            }
            if (user.emailConfirmation.isConfirmed) {
                throw new Error("user email already confirmed");
            }
            return true;
        }));
    }
};
EmailResendingValidation = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(users_db_query_repository_1.UsersQueryRepository)),
    __metadata("design:paramtypes", [users_db_query_repository_1.UsersQueryRepository])
], EmailResendingValidation);
exports.EmailResendingValidation = EmailResendingValidation;
