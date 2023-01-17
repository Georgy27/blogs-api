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
require("dotenv").config();
const db_1 = require("./repositories/db");
const server_1 = require("./utils/server");
// remove app to a different folder
const app = (0, server_1.createServer)();
const port = 3000;
function sleep(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield sleep(10);
    console.log(process.env.PORT);
    console.log(process.env.MONGO_URL);
    yield (0, db_1.runDb)();
    app.listen(port, () => {
        console.log(`App is listening on the port ${port}`);
    });
});
startApp();
