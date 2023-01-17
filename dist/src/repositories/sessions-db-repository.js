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
exports.sessionRepository = void 0;
const session_schema_1 = require("../models/sessions-model/session-schema");
exports.sessionRepository = {
    saveNewSession(tokenData) {
        return __awaiter(this, void 0, void 0, function* () {
            return session_schema_1.SessionsModel.create(Object.assign({}, tokenData));
        });
    },
    findAllActiveSessions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const devices = yield session_schema_1.SessionsModel.find({ userId }, { _id: false }).lean();
            const newDevices = devices.map((device) => {
                return {
                    ip: device.ip,
                    title: device.deviceName,
                    lastActiveDate: device.lastActiveDate,
                    deviceId: device.deviceId,
                };
            });
            return newDevices;
        });
    },
    findLastActiveDate(userId, lastActiveDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return session_schema_1.SessionsModel.findOne({ userId, lastActiveDate });
        });
    },
    updateLastActiveDate(deviceId, lastActiveDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield session_schema_1.SessionsModel.updateOne({ deviceId }, { lastActiveDate });
            return result.matchedCount === 1;
        });
    },
    findDeviceById(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return session_schema_1.SessionsModel.findOne({ deviceId });
        });
    },
    deleteSessionByDeviceID(deviceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedToken = yield session_schema_1.SessionsModel.deleteOne({
                userId,
                deviceId,
            });
            return deletedToken.deletedCount === 1;
        });
    },
    deleteAllSessionsExceptCurrent(deviceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return session_schema_1.SessionsModel.deleteMany({
                userId,
                deviceId: { $ne: deviceId },
            });
        });
    },
};
