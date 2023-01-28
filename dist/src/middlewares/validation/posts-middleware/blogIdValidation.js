"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
const inversify_1 = require("inversify");
const blogs_db_query_repository_1 = require("../../../repositories/blogs-db-query-repository");
let BlogIdValidation = class BlogIdValidation {
    constructor(blogsQueryRepository) {
        this.blogsQueryRepository = blogsQueryRepository;
        this.blogIdValidation = (0, express_validator_1.body)("blogId")
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
};
BlogIdValidation = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(blogs_db_query_repository_1.BlogsQueryRepository)),
    __metadata("design:paramtypes", [blogs_db_query_repository_1.BlogsQueryRepository])
], BlogIdValidation);
exports.BlogIdValidation = BlogIdValidation;
