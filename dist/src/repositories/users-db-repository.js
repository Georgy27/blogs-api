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
exports.usersRepository = void 0;
const db_1 = require("./db");
const crypto_1 = require("crypto");
exports.usersRepository = {
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.usersCollection.insertOne(Object.assign({}, user));
            return user;
        });
    },
    createUserByAdmin(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.usersCollection.insertOne(Object.assign({}, user));
            return {
                id: user.id,
                login: user.accountData.login,
                email: user.accountData.email,
                createdAt: user.accountData.createdAt,
            };
        });
    },
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.usersCollection.deleteOne({ id });
            return result.deletedCount === 1;
        });
    },
    updateConfirmation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield db_1.usersCollection.updateOne({ id }, { $set: { "emailConfirmation.isConfirmed": true } });
            return updatedUser.modifiedCount === 1;
        });
    },
    updateConfirmationCode(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield db_1.usersCollection.findOneAndUpdate({ id }, {
                $set: { "emailConfirmation.confirmationCode": (0, crypto_1.randomUUID)() },
            }, { returnDocument: "after" });
            if (updatedUser.ok !== 1)
                return null;
            return updatedUser.value;
        });
    },
    clearUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.usersCollection.deleteMany({});
        });
    },
};
