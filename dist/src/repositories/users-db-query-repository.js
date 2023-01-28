"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.UsersQueryRepository = void 0;
const helpers_1 = require("../utils/helpers");
const user_schema_1 = require("../models/users-model/user-schema");
const inversify_1 = require("inversify");
let UsersQueryRepository = class UsersQueryRepository {
    findUsers(pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {
                $or: [
                    {
                        "accountData.login": { $regex: searchLoginTerm !== null && searchLoginTerm !== void 0 ? searchLoginTerm : "", $options: "i" },
                    },
                    {
                        "accountData.email": { $regex: searchEmailTerm !== null && searchEmailTerm !== void 0 ? searchEmailTerm : "", $options: "i" },
                    },
                ],
            };
            const users = yield user_schema_1.UsersModel.find(filter, {
                projection: { _id: false, "accountData.passwordHash": false },
            })
                .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .lean();
            const numberOfUsers = yield user_schema_1.UsersModel.countDocuments(filter);
            console.log(users);
            return {
                pagesCount: Math.ceil(numberOfUsers / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: numberOfUsers,
                items: (0, helpers_1.mappedUsers)(users),
            };
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_schema_1.UsersModel.findOne({ id }, { _id: false });
            if (user) {
                return {
                    email: user.accountData.email,
                    login: user.accountData.login,
                    userId: user.id,
                };
            }
            return null;
        });
    }
    findByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_schema_1.UsersModel.findOne({
                $or: [
                    { "accountData.email": loginOrEmail },
                    { "accountData.login": loginOrEmail },
                ],
            }).lean();
            return user;
        });
    }
    findUserByEmailConfirmationCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_schema_1.UsersModel.findOne({
                "emailConfirmation.confirmationCode": code,
            }).lean();
            return user;
        });
    }
    findUserByPasswordConfirmationCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_schema_1.UsersModel.findOne({
                "passwordRecovery.recoveryCode": code,
            }).lean();
            return user;
        });
    }
};
UsersQueryRepository = __decorate([
    (0, inversify_1.injectable)()
], UsersQueryRepository);
exports.UsersQueryRepository = UsersQueryRepository;
