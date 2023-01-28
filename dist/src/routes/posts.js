"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const basic_auth_middleware_1 = require("../middlewares/auth/basic-auth-middleware");
const input_validation_middleware_1 = require("../middlewares/validation/input-validation-middleware");
const sorting_pagination_middleware_1 = require("../middlewares/validation/sorting&pagination-middleware");
const titleValidation_1 = require("../middlewares/validation/posts-middleware/titleValidation");
const shortDescriptionValidation_1 = require("../middlewares/validation/posts-middleware/shortDescriptionValidation");
const contentValidation_1 = require("../middlewares/validation/posts-middleware/contentValidation");
const content_validation_1 = require("../middlewares/validation/comments-middleware/content-validation");
const morgan_middleware_1 = require("../middlewares/morgan-middleware");
const composition_root_1 = require("../composition-root");
const PostsController_1 = require("../controllers/PostsController");
const jwt_auth_middleware_1 = require("../middlewares/auth/jwt-auth-middleware");
const blogIdValidation_1 = require("../middlewares/validation/posts-middleware/blogIdValidation");
exports.postsRouter = (0, express_1.Router)({});
const postsController = composition_root_1.container.resolve(PostsController_1.PostsController);
const jwtMw = composition_root_1.container.resolve(jwt_auth_middleware_1.JwtAuthMiddleware);
const getUserIdFromAccessTokenMw = composition_root_1.container.resolve(jwt_auth_middleware_1.GetUserIdFromAccessToken);
const blogIdValidation = composition_root_1.container.resolve(blogIdValidation_1.BlogIdValidation);
// routes
exports.postsRouter.get("/", sorting_pagination_middleware_1.pageSize, sorting_pagination_middleware_1.sortBy, sorting_pagination_middleware_1.pageNumberValidation, (0, morgan_middleware_1.morgan)("tiny"), postsController.getAllPosts.bind(postsController));
exports.postsRouter.get("/:postId/comments", sorting_pagination_middleware_1.pageSize, sorting_pagination_middleware_1.sortBy, sorting_pagination_middleware_1.pageNumberValidation, getUserIdFromAccessTokenMw.use.bind(getUserIdFromAccessTokenMw), (0, morgan_middleware_1.morgan)("tiny"), postsController.getAllCommentsForSpecifiedPost.bind(postsController));
exports.postsRouter.post("/", basic_auth_middleware_1.basicAuthMiddleware, titleValidation_1.titleValidation, shortDescriptionValidation_1.shortDescriptionValidation, contentValidation_1.contentValidation, blogIdValidation.blogIdValidation.bind(blogIdValidation), input_validation_middleware_1.inputValidationMiddleware, (0, morgan_middleware_1.morgan)("tiny"), postsController.createPost.bind(postsController));
exports.postsRouter.post("/:postId/comments", jwtMw.use.bind(jwtMw), content_validation_1.commentsValidation, input_validation_middleware_1.inputValidationMiddleware, (0, morgan_middleware_1.morgan)("tiny"), postsController.createCommentForSpecifiedPost.bind(postsController));
exports.postsRouter.get("/:id", (0, morgan_middleware_1.morgan)("tiny"), postsController.getPostById.bind(postsController));
exports.postsRouter.put("/:id", basic_auth_middleware_1.basicAuthMiddleware, titleValidation_1.titleValidation, shortDescriptionValidation_1.shortDescriptionValidation, contentValidation_1.contentValidation, blogIdValidation.blogIdValidation.bind(blogIdValidation), input_validation_middleware_1.inputValidationMiddleware, (0, morgan_middleware_1.morgan)("tiny"), postsController.updatePost.bind(postsController));
exports.postsRouter.delete("/:id", basic_auth_middleware_1.basicAuthMiddleware, (0, morgan_middleware_1.morgan)("tiny"), postsController.deletePostById.bind(postsController));
