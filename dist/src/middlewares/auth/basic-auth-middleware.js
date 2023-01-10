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
exports.basicAuthMiddleware = void 0;
const basicAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = req.headers.authorization;
    if (!auth)
        return res.sendStatus(401);
    const authType = auth.split(" ")[0];
    const authPayload = auth.split(" ")[1];
    if (authType !== "Basic")
        return res.sendStatus(401);
    const decodedPayload = Buffer.from(authPayload, "base64").toString();
    if (decodedPayload !== "admin:qwerty")
        return res.sendStatus(401);
    return next();
});
exports.basicAuthMiddleware = basicAuthMiddleware;
