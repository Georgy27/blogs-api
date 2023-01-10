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
exports.securityDevicesRouter = void 0;
const express_1 = require("express");
const refresh_token_middleware_1 = require("../middlewares/auth/refresh-token-middleware");
const sessions_db_repository_1 = require("../repositories/sessions-db-repository");
const securityDevices_service_1 = require("../domain/securityDevices-service");
exports.securityDevicesRouter = (0, express_1.Router)({});
exports.securityDevicesRouter.get("/", refresh_token_middleware_1.refreshTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const devices = yield sessions_db_repository_1.sessionRepository.findAllActiveSessions(userId);
    return res.status(200).send(devices);
}));
exports.securityDevicesRouter.delete("/", refresh_token_middleware_1.refreshTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const deviceId = req.jwtPayload.deviceId;
    const terminateDevices = yield securityDevices_service_1.securityDevicesService.logOutDevices(deviceId, userId);
    return res.sendStatus(204);
}));
exports.securityDevicesRouter.delete("/:deviceId", refresh_token_middleware_1.refreshTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deviceId = req.params.deviceId;
    const userId = req.user.userId;
    const result = yield securityDevices_service_1.securityDevicesService.logOutDevice(deviceId, userId);
    if (result === 403)
        return res.sendStatus(403);
    if (result === 404)
        return res.sendStatus(404);
    return res.sendStatus(204);
}));
