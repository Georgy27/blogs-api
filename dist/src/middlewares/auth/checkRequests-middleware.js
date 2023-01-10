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
exports.checkRequests = void 0;
const memoryRequests = [];
const checkRequests = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const blockTimeOut = 10 * 1000;
    const connectionsLimit = 5;
    const path = req.path;
    const ip = req.ip;
    const connectionAt = Date.now().toString();
    memoryRequests.push({ ip, path, connectionAt });
    const connectionsCount = memoryRequests.filter((r) => r.ip === ip &&
        r.path === path &&
        +connectionAt - +r.connectionAt <= blockTimeOut).length;
    if (connectionsCount > connectionsLimit)
        return res.sendStatus(429);
    return next();
});
exports.checkRequests = checkRequests;
// const requests = await connDb.countDocuments({
//   ip,
//   path,
//   date: { $gte: addSeconds(connectionAt, -blockTimeOut).toISOString() },
// });
