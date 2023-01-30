"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const basic_auth_middleware_1 = require("../middlewares/auth/basic-auth-middleware");
const input_validation_middleware_1 = require("../middlewares/validation/input-validation-middleware");
const nameValidation_1 = require("../middlewares/validation/blogs-middleware/nameValidation");
const descriptionValidation_1 = require("../middlewares/validation/blogs-middleware/descriptionValidation");
const websiteValidation_1 = require("../middlewares/validation/blogs-middleware/websiteValidation");
const sorting_pagination_middleware_1 = require("../middlewares/validation/sorting&pagination-middleware");
const contentValidation_1 = require("../middlewares/validation/posts-middleware/contentValidation");
const titleValidation_1 = require("../middlewares/validation/posts-middleware/titleValidation");
const shortDescriptionValidation_1 = require("../middlewares/validation/posts-middleware/shortDescriptionValidation");
const morgan_middleware_1 = require("../middlewares/morgan-middleware");
const composition_root_1 = require("../composition-root");
const BlogsController_1 = require("../controllers/BlogsController");
const jwt_auth_middleware_1 = require("../middlewares/auth/jwt-auth-middleware");
const blogsController = composition_root_1.container.resolve(BlogsController_1.BlogsController);
const getUserIdFromAccessTokenMw = composition_root_1.container.resolve(jwt_auth_middleware_1.GetUserIdFromAccessToken);
exports.blogsRouter = (0, express_1.Router)({});
// routes
exports.blogsRouter.get("/", sorting_pagination_middleware_1.pageSize, sorting_pagination_middleware_1.sortBy, sorting_pagination_middleware_1.pageNumberValidation, (0, morgan_middleware_1.morgan)("tiny"), blogsController.getAllBlogs.bind(blogsController));
exports.blogsRouter.get("/:blogId/posts", sorting_pagination_middleware_1.pageSize, sorting_pagination_middleware_1.sortBy, sorting_pagination_middleware_1.pageNumberValidation, getUserIdFromAccessTokenMw.use.bind(getUserIdFromAccessTokenMw), (0, morgan_middleware_1.morgan)("tiny"), blogsController.getAllPostsForSpecifiedBlog.bind(blogsController));
exports.blogsRouter.post("/", basic_auth_middleware_1.basicAuthMiddleware, nameValidation_1.nameValidation, descriptionValidation_1.descriptionValidation, websiteValidation_1.websiteValidation, input_validation_middleware_1.inputValidationMiddleware, (0, morgan_middleware_1.morgan)("tiny"), blogsController.createBlog.bind(blogsController));
exports.blogsRouter.post("/:blogId/posts", basic_auth_middleware_1.basicAuthMiddleware, titleValidation_1.titleValidation, shortDescriptionValidation_1.shortDescriptionValidation, contentValidation_1.contentValidation, input_validation_middleware_1.inputValidationMiddleware, (0, morgan_middleware_1.morgan)("tiny"), blogsController.createPostForSpecifiedBlog.bind(blogsController));
exports.blogsRouter.get("/:id", (0, morgan_middleware_1.morgan)("tiny"), blogsController.getBlogById.bind(blogsController));
exports.blogsRouter.put("/:id", basic_auth_middleware_1.basicAuthMiddleware, nameValidation_1.nameValidation, descriptionValidation_1.descriptionValidation, websiteValidation_1.websiteValidation, input_validation_middleware_1.inputValidationMiddleware, (0, morgan_middleware_1.morgan)("tiny"), blogsController.updateBlogById.bind(blogsController));
exports.blogsRouter.delete("/:id", basic_auth_middleware_1.basicAuthMiddleware, (0, morgan_middleware_1.morgan)("tiny"), blogsController.deleteBlogById.bind(blogsController));
