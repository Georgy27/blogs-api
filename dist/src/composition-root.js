"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testController = exports.securityDeviceController = exports.authController = exports.commentsController = exports.usersController = exports.postsController = exports.blogsController = exports.emailResendingValidation = exports.emailRegistrationValidation = exports.loginValidation = exports.blogIdValidation = exports.confirmEmail = exports.confirmRecoveryCode = exports.refreshTokenMiddleware = exports.jwtAuthMiddleware = void 0;
const blogs_db_repository_1 = require("./repositories/blogs-db-repository");
const blogs_db_query_repository_1 = require("./repositories/blogs-db-query-repository");
const blogs_service_1 = require("./domain/blogs-service");
const BlogsController_1 = require("./controllers/BlogsController");
const posts_db_repository_1 = require("./repositories/posts-db-repository");
const posts_db_query_repository_1 = require("./repositories/posts-db-query-repository");
const posts_service_1 = require("./domain/posts-service");
const PostsController_1 = require("./controllers/PostsController");
const comments_db_repository_1 = require("./repositories/comments-db-repository");
const comments_db_query_repository_1 = require("./repositories/comments-db-query-repository");
const comments_service_1 = require("./domain/comments-service");
const users_db_repository_1 = require("./repositories/users-db-repository");
const users_db_query_repository_1 = require("./repositories/users-db-query-repository");
const users_service_1 = require("./domain/users-service");
const UsersController_1 = require("./controllers/UsersController");
const CommentsController_1 = require("./controllers/CommentsController");
const jwt_auth_middleware_1 = require("./middlewares/auth/jwt-auth-middleware");
const sessions_db_repository_1 = require("./repositories/sessions-db-repository");
const auth_service_1 = require("./domain/auth-service");
const jwt_service_1 = require("./application/jwt-service");
const emails_manager_1 = require("./managers/emails-manager");
const email_adapter_1 = require("./adapters/email-adapter");
const AuthController_1 = require("./controllers/AuthController");
const refresh_token_middleware_1 = require("./middlewares/auth/refresh-token-middleware");
const recoveryCodeValidation_1 = require("./middlewares/validation/auth-middleware/recoveryCodeValidation");
const SecurityDevicesController_1 = require("./controllers/SecurityDevicesController");
const securityDevices_service_1 = require("./domain/securityDevices-service");
const TestController_1 = require("./controllers/TestController");
const confirmEmail_1 = require("./middlewares/validation/auth-middleware/confirmEmail");
const blogIdValidation_1 = require("./middlewares/validation/posts-middleware/blogIdValidation");
const loginValidation_1 = require("./middlewares/validation/users-middleware/loginValidation");
const emailRegistrationValidation_1 = require("./middlewares/validation/users-middleware/emailRegistrationValidation");
const emailResendingValidation_1 = require("./middlewares/validation/auth-middleware/emailResendingValidation");
const blogsRepository = new blogs_db_repository_1.BlogsRepository();
const blogsQueryRepository = new blogs_db_query_repository_1.BlogsQueryRepository();
const blogsService = new blogs_service_1.BlogsService(blogsRepository);
const postsRepository = new posts_db_repository_1.PostsRepository();
const postsQueryRepository = new posts_db_query_repository_1.PostsQueryRepository();
const postsService = new posts_service_1.PostsService(postsRepository, blogsQueryRepository);
const commentsRepository = new comments_db_repository_1.CommentsRepository();
const commentsQueryRepository = new comments_db_query_repository_1.CommentsQueryRepository();
const commentsService = new comments_service_1.CommentsService(commentsRepository, postsQueryRepository, commentsQueryRepository);
const emailAdapter = new email_adapter_1.EmailAdapter();
const emailsManager = new emails_manager_1.EmailsManager(emailAdapter);
const usersRepository = new users_db_repository_1.UsersRepository();
const usersQueryRepository = new users_db_query_repository_1.UsersQueryRepository();
const usersService = new users_service_1.UsersService(usersRepository, usersQueryRepository, emailsManager);
const sessionRepository = new sessions_db_repository_1.SessionRepository();
const jwtService = new jwt_service_1.JwtService(sessionRepository);
const authService = new auth_service_1.AuthService(usersService, jwtService, sessionRepository, usersQueryRepository, emailsManager);
const securityDevicesService = new securityDevices_service_1.SecurityDevicesService(sessionRepository);
// middlewares
exports.jwtAuthMiddleware = new jwt_auth_middleware_1.JwtAuthMiddleware(usersQueryRepository, jwtService);
exports.refreshTokenMiddleware = new refresh_token_middleware_1.RefreshTokenMiddleware(jwtService, usersQueryRepository, sessionRepository);
exports.confirmRecoveryCode = new recoveryCodeValidation_1.ConfirmRecoveryCode(usersQueryRepository);
exports.confirmEmail = new confirmEmail_1.ConfirmEmail(usersQueryRepository);
exports.blogIdValidation = new blogIdValidation_1.BlogIdValidation(blogsQueryRepository);
exports.loginValidation = new loginValidation_1.LoginValidation(usersQueryRepository);
exports.emailRegistrationValidation = new emailRegistrationValidation_1.EmailRegistrationValidation(usersQueryRepository);
exports.emailResendingValidation = new emailResendingValidation_1.EmailResendingValidation(usersQueryRepository);
// controllers
exports.blogsController = new BlogsController_1.BlogsController(blogsService, blogsQueryRepository, postsQueryRepository, postsService);
exports.postsController = new PostsController_1.PostsController(postsService, postsQueryRepository, commentsService, commentsQueryRepository);
exports.usersController = new UsersController_1.UsersController(usersService, usersQueryRepository);
exports.commentsController = new CommentsController_1.CommentsController(commentsService, commentsQueryRepository);
exports.authController = new AuthController_1.AuthController(authService, usersService, sessionRepository);
exports.securityDeviceController = new SecurityDevicesController_1.SecurityDevicesController(sessionRepository, securityDevicesService);
exports.testController = new TestController_1.TestController(blogsRepository, postsRepository, usersRepository, commentsRepository);
