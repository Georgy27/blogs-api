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
const db_1 = require("./db");
exports.blogsQueryRepository = {
    findBlogs(searchNameTerm, pageSize, sortBy, pageNumber, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            if (searchNameTerm) {
                filter.name = { $regex: searchNameTerm, $options: "i" };
            }
            const blogs = yield db_1.blogsCollection
                .find(filter, { projection: { _id: false } })
                .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray();
            const numberOfBlogs = yield db_1.blogsCollection.countDocuments(filter);
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
            const blog = yield db_1.blogsCollection.findOne({ id }, { projection: { _id: false } });
            return blog;
        });
    },
};
