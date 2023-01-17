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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDb = exports.refreshTokensMetaCollection = exports.db = void 0;
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const settings_1 = require("../settings");
const mongoUrl = settings_1.settings.mongo.url;
if (!mongoUrl) {
    throw new Error("Can't connect to db");
}
const client = new mongodb_1.MongoClient(mongoUrl);
exports.db = client.db("blog-api");
exports.refreshTokensMetaCollection = exports.db.collection("refresh_tokens");
function runDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            yield mongoose_1.default.connect(mongoUrl, { retryWrites: true, w: "majority" });
            console.log("Connected successfully to mongo server");
        }
        catch (_a) {
            console.log("Can't connect to db");
            yield mongoose_1.default.disconnect();
        }
    });
}
exports.runDb = runDb;
