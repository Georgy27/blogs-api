"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const blogs_db_repository_1 = require("./repositories/blogs-db-repository");
const blogs_db_query_repository_1 = require("./repositories/blogs-db-query-repository");
const blogs_service_1 = require("./domain/blogs-service");
const posts_db_repository_1 = require("./repositories/posts-db-repository");
const posts_db_query_repository_1 = require("./repositories/posts-db-query-repository");
const posts_service_1 = require("./domain/posts-service");
const comments_db_repository_1 = require("./repositories/comments-db-repository");
const comments_db_query_repository_1 = require("./repositories/comments-db-query-repository");
const comments_service_1 = require("./domain/comments-service");
const users_db_repository_1 = require("./repositories/users-db-repository");
const users_db_query_repository_1 = require("./repositories/users-db-query-repository");
const users_service_1 = require("./domain/users-service");
const jwt_auth_middleware_1 = require("./middlewares/auth/jwt-auth-middleware");
const sessions_db_repository_1 = require("./repositories/sessions-db-repository");
const auth_service_1 = require("./domain/auth-service");
const jwt_service_1 = require("./application/jwt-service");
const emails_manager_1 = require("./managers/emails-manager");
const email_adapter_1 = require("./adapters/email-adapter");
const refresh_token_middleware_1 = require("./middlewares/auth/refresh-token-middleware");
const securityDevices_service_1 = require("./domain/securityDevices-service");
const reactions_db_repository_1 = require("./repositories/reactions-db-repository");
const reactions_service_1 = require("./domain/reactions-service");
const inversify_1 = require("inversify");
const confirmEmail_1 = require("./middlewares/validation/auth-middleware/confirmEmail");
const emailResendingValidation_1 = require("./middlewares/validation/auth-middleware/emailResendingValidation");
const recoveryCodeValidation_1 = require("./middlewares/validation/auth-middleware/recoveryCodeValidation");
const emails_service_1 = require("./domain/emails-service");
const loginValidation_1 = require("./middlewares/validation/users-middleware/loginValidation");
const emailRegistrationValidation_1 = require("./middlewares/validation/users-middleware/emailRegistrationValidation");
const blogIdValidation_1 = require("./middlewares/validation/posts-middleware/blogIdValidation");
// const blogsRepository = new BlogsRepository();
// export const blogsQueryRepository = new BlogsQueryRepository();
// const blogsService = new BlogsService(blogsRepository);
//
// const postsRepository = new PostsRepository();
// const postsQueryRepository = new PostsQueryRepository();
// const postsService = new PostsService(postsRepository, blogsQueryRepository);
//
// const reactionsRepository = new ReactionsRepository();
// const reactionsService = new ReactionsService(reactionsRepository);
//
// const commentsRepository = new CommentsRepository();
// const commentsQueryRepository = new CommentsQueryRepository();
// const commentsService = new CommentsService(
//   commentsRepository,
//   postsQueryRepository,
//   commentsQueryRepository
// );
// const emailAdapter = new EmailAdapter();
// const emailsManager = new EmailsManager(emailAdapter);
//
// const usersRepository = new UsersRepository();
// export const usersQueryRepository = new UsersQueryRepository();
// const usersService = new UsersService(
//   usersRepository,
//   usersQueryRepository,
//   emailsManager
// );
//
// const sessionRepository = new SessionRepository();
// const jwtService = new JwtService(sessionRepository);
// const authService = new AuthService(
//   usersService,
//   jwtService,
//   sessionRepository,
//   usersQueryRepository,
//   emailsManager
// );
// const securityDevicesService = new SecurityDevicesService(sessionRepository);
//
// // middlewares
// export const jwtAuthMiddleware = new JwtAuthMiddleware(
//   usersQueryRepository,
//   jwtService
// );
// export const refreshTokenMiddleware = new RefreshTokenMiddleware(
//   jwtService,
//   usersQueryRepository,
//   sessionRepository
// );
// export const getUserIdFromAccessToken = new GetUserIdFromAccessToken(
//   usersQueryRepository,
//   jwtService
// );
// // controllers
// export const blogsController = new BlogsController(
//   blogsService,
//   blogsQueryRepository,
//   postsQueryRepository,
//   postsService
// );
// export const postsController = new PostsController(
//   postsService,
//   postsQueryRepository,
//   commentsService,
//   commentsQueryRepository
// );
// export const usersController = new UsersController(
//   usersService,
//   usersQueryRepository
// );
// export const commentsController = new CommentsController(
//   commentsService,
//   commentsQueryRepository,
//   reactionsService
// );
// export const authController = new AuthController(
//   authService,
//   usersService,
//   sessionRepository
// );
// export const securityDeviceController = new SecurityDevicesController(
//   sessionRepository,
//   securityDevicesService
// );
// export const testController = new TestController(
//   blogsRepository,
//   postsRepository,
//   usersRepository,
//   commentsRepository,
//   reactionsRepository
// );
exports.container = new inversify_1.Container();
// Blogs
exports.container.bind(blogs_db_repository_1.BlogsRepository).toSelf();
exports.container.bind(blogs_db_query_repository_1.BlogsQueryRepository).toSelf();
exports.container.bind(blogs_service_1.BlogsService).toSelf();
// Posts
exports.container.bind(posts_db_repository_1.PostsRepository).toSelf();
exports.container.bind(posts_db_query_repository_1.PostsQueryRepository).toSelf();
exports.container.bind(posts_service_1.PostsService).toSelf();
// Comments
exports.container.bind(comments_db_repository_1.CommentsRepository).toSelf();
exports.container.bind(comments_db_query_repository_1.CommentsQueryRepository).toSelf();
exports.container.bind(comments_service_1.CommentsService).toSelf();
// Email
exports.container.bind(email_adapter_1.EmailAdapter).toSelf();
exports.container.bind(emails_manager_1.EmailsManager).toSelf();
exports.container.bind(emails_service_1.EmailsService).toSelf();
// Users
exports.container.bind(users_db_repository_1.UsersRepository).toSelf();
exports.container.bind(users_db_query_repository_1.UsersQueryRepository).toSelf();
exports.container.bind(users_service_1.UsersService).toSelf();
// Security Devices
exports.container.bind(sessions_db_repository_1.SessionRepository).toSelf();
exports.container.bind(securityDevices_service_1.SecurityDevicesService).toSelf();
// Jwt
exports.container.bind(jwt_service_1.JwtService).toSelf();
// Auth
exports.container.bind(auth_service_1.AuthService).toSelf();
// Reactions
exports.container.bind(reactions_db_repository_1.ReactionsRepository).toSelf();
exports.container.bind(reactions_service_1.ReactionsService).toSelf();
// Middlewares
exports.container.bind(jwt_auth_middleware_1.JwtAuthMiddleware).toSelf();
exports.container.bind(refresh_token_middleware_1.RefreshTokenMiddleware).toSelf();
exports.container.bind(jwt_auth_middleware_1.GetUserIdFromAccessToken).toSelf();
exports.container.bind(confirmEmail_1.ConfirmEmail).toSelf();
exports.container.bind(emailResendingValidation_1.EmailResendingValidation).toSelf();
exports.container.bind(recoveryCodeValidation_1.ConfirmRecoveryCode).toSelf();
exports.container.bind(loginValidation_1.LoginValidation).toSelf();
exports.container.bind(emailRegistrationValidation_1.EmailRegistrationValidation).toSelf();
exports.container.bind(blogIdValidation_1.BlogIdValidation).toSelf();
