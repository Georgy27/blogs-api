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
exports.securityDevicesService = void 0;
const sessions_db_repository_1 = require("../repositories/sessions-db-repository");
exports.securityDevicesService = {
    logOutDevices(deviceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return sessions_db_repository_1.sessionRepository.deleteAllSessionsExceptCurrent(deviceId, userId);
        });
    },
    logOutDevice(deviceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // find device
            const device = yield sessions_db_repository_1.sessionRepository.findDeviceById(deviceId);
            if (!device)
                return 404;
            // check for user
            if (device.userId !== userId)
                return 403;
            return sessions_db_repository_1.sessionRepository.deleteSessionByDeviceID(deviceId, userId);
        });
    },
};
