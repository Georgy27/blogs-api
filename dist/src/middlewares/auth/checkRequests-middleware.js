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
    // const blockTimeOut = 10 * 1000;
    // const connectionsLimit = 5;
    // const connectionAt = +new Date();
    const path = req.path;
    const ip = req.ip;
    const connectionsCount = memoryRequests.filter((r) => r.ip === ip && r.path === path);
    const currentDate = new Date().toISOString();
    const requestsNumber = connectionsCount.filter((r) => +currentDate - +r.date <= 10 * 1000);
    if (requestsNumber.length > 5) {
        return res.sendStatus(429);
    }
    memoryRequests.push({ ip, path, date: currentDate });
    next();
});
exports.checkRequests = checkRequests;
// const requests = await connDb.countDocuments({
//   ip,
//   path,
//   date: { $gte: addSeconds(connectionAt, -blockTimeOut).toISOString() },
// });
