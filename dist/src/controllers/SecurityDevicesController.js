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
exports.SecurityDevicesController = void 0;
class SecurityDevicesController {
    constructor(sessionRepository, securityDevicesService) {
        this.sessionRepository = sessionRepository;
        this.securityDevicesService = securityDevicesService;
    }
    getAllDevicesWithActiveSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.userId;
            const devices = yield this.sessionRepository.findAllActiveSessions(userId);
            return res.status(200).send(devices);
        });
    }
    deleteAllDevicesSessionsButActive(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.userId;
            const deviceId = req.jwtPayload.deviceId;
            const terminateDevices = yield this.securityDevicesService.logOutDevices(deviceId, userId);
            return res.sendStatus(204);
        });
    }
    deleteDeviceSessionById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceId = req.params.deviceId;
            const userId = req.user.userId;
            const result = yield this.securityDevicesService.logOutDevice(deviceId, userId);
            if (result === 403)
                return res.sendStatus(403);
            if (result === 404)
                return res.sendStatus(404);
            return res.sendStatus(204);
        });
    }
}
exports.SecurityDevicesController = SecurityDevicesController;
