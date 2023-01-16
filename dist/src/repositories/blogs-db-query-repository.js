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
exports.blogsQueryRepository = void 0;
const blog_schema_1 = require("../models/blogs-model/blog-schema");
exports.blogsQueryRepository = {
    findBlogs(searchNameTerm, pageSize, sortBy, pageNumber, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {
                $regex: searchNameTerm !== null && searchNameTerm !== void 0 ? searchNameTerm : "",
                $options: "i",
            };
            const blogs = yield blog_schema_1.BlogsModel.find(filter, { _id: false })
                .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .lean();
            const numberOfBlogs = yield blog_schema_1.BlogsModel.countDocuments(filter);
            return {
                pagesCount: Math.ceil(numberOfBlogs / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: numberOfBlogs,
                items: blogs,
            };
        });
    },
    findBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blog_schema_1.BlogsModel.findOne({ id }, { _id: false });
            return blog;
        });
    },
};
