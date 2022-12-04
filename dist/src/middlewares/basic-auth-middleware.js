"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuthMiddleware = void 0;
const basicAuthMiddleware = (req, res, next) => {
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
};
exports.basicAuthMiddleware = basicAuthMiddleware;
