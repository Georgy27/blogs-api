"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const testing_1 = require("../routes/testing");
const blogs_1 = require("../routes/blogs");
const posts_1 = require("../routes/posts");
const users_1 = require("../routes/users");
const auth_1 = require("../routes/auth");
function createServer() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    // routes
    app.use("/testing/all-data", testing_1.testingRouter);
    app.use("/blogs", blogs_1.blogsRouter);
    app.use("/posts", posts_1.postsRouter);
    app.use("/users", users_1.usersRouter);
    app.use("/auth/login", auth_1.authRouter);
    return app;
}
exports.createServer = createServer;
