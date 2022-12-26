"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mappedUsers = void 0;
const mappedUsers = function (users) {
    const newUsers = users.map((user) => {
        return {
            id: user.id,
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt,
        };
    });
    return newUsers;
};
exports.mappedUsers = mappedUsers;
