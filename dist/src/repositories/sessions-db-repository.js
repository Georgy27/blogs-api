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
exports.SessionRepository = void 0;
const session_schema_1 = require("../models/sessions-model/session-schema");
const inversify_1 = require("inversify");
let SessionRepository = class SessionRepository {
    saveNewSession(tokenData) {
        return __awaiter(this, void 0, void 0, function* () {
            return session_schema_1.SessionsModel.create(Object.assign({}, tokenData));
        });
    }
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
    }
    findLastActiveDate(userId, lastActiveDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return session_schema_1.SessionsModel.findOne({ userId, lastActiveDate });
        });
    }
    updateLastActiveDate(deviceId, lastActiveDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield session_schema_1.SessionsModel.updateOne({ deviceId }, { lastActiveDate });
            return result.matchedCount === 1;
        });
    }
    findDeviceById(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return session_schema_1.SessionsModel.findOne({ deviceId });
        });
    }
    deleteSessionByDeviceID(deviceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedToken = yield session_schema_1.SessionsModel.deleteOne({
                userId,
                deviceId,
            });
            return deletedToken.deletedCount === 1;
        });
    }
    deleteAllSessionsExceptCurrent(deviceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return session_schema_1.SessionsModel.deleteMany({
                userId,
                deviceId: { $ne: deviceId },
            });
        });
    }
};
SessionRepository = __decorate([
    (0, inversify_1.injectable)()
], SessionRepository);
exports.SessionRepository = SessionRepository;
