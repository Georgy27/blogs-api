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
exports.BlogIdValidation = void 0;
const express_validator_1 = require("express-validator");
class BlogIdValidation {
    constructor(blogsQueryRepository) {
        this.blogsQueryRepository = blogsQueryRepository;
    }
    use() {
        (0, express_validator_1.body)("blogId")
            .isString()
            .custom((blogId) => __awaiter(this, void 0, void 0, function* () {
            const findBlogWithId = yield this.blogsQueryRepository.findBlog(blogId);
            if (!findBlogWithId) {
                throw new Error("blog with this id does not exist in the DB");
            }
            else {
                return true;
            }
        }));
    }
}
exports.BlogIdValidation = BlogIdValidation;
