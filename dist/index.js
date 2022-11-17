"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const blogs_1 = require("./routes/blogs");
const posts_1 = require("./routes/posts");
exports.app = (0, express_1.default)();
const port = 3000;
// app.use()
exports.app.use(express_1.default.json());
// routes
exports.app.use("/blogs", blogs_1.blogsRouter);
exports.app.use("/posts", posts_1.postsRouter);
exports.app.listen(port, () => {
    console.log(`App is listening on the port ${port}`);
});
