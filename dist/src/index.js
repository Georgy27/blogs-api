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
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const blogs_1 = require("./routes/blogs");
const posts_1 = require("./routes/posts");
const testing_1 = require("./routes/testing");
const db_1 = require("./repositories/db");
const users_1 = require("./routes/users");
const auth_1 = require("./routes/auth");
// remove app to a different folder
exports.app = (0, express_1.default)();
const port = 3000;
// app.use()
exports.app.use(express_1.default.json());
// routes
exports.app.use("/testing/all-data", testing_1.testingRouter);
exports.app.use("/blogs", blogs_1.blogsRouter);
exports.app.use("/posts", posts_1.postsRouter);
exports.app.use("/users", users_1.usersRouter);
exports.app.use("/auth/login", auth_1.authRouter);
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.runDb)();
    exports.app.listen(port, () => {
        console.log(`App is listening on the port ${port}`);
    });
});
startApp();
