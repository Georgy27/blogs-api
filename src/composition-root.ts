import "reflect-metadata";
import { BlogsRepository } from "./repositories/blogs-db-repository";
import { BlogsQueryRepository } from "./repositories/blogs-db-query-repository";
import { BlogsService } from "./domain/blogs-service";
import { BlogsController } from "./controllers/BlogsController";
import { PostsRepository } from "./repositories/posts-db-repository";
import { PostsQueryRepository } from "./repositories/posts-db-query-repository";
import { PostsService } from "./domain/posts-service";
import { PostsController } from "./controllers/PostsController";
import { CommentsRepository } from "./repositories/comments-db-repository";
import { CommentsQueryRepository } from "./repositories/comments-db-query-repository";
import { CommentsService } from "./domain/comments-service";
import { UsersRepository } from "./repositories/users-db-repository";
import { UsersQueryRepository } from "./repositories/users-db-query-repository";
import { UsersService } from "./domain/users-service";
import { UsersController } from "./controllers/UsersController";
import { CommentsController } from "./controllers/CommentsController";
import {
  GetUserIdFromAccessToken,
  JwtAuthMiddleware,
} from "./middlewares/auth/jwt-auth-middleware";
import { SessionRepository } from "./repositories/sessions-db-repository";
import { AuthService } from "./domain/auth-service";
import { JwtService } from "./application/jwt-service";
import { EmailsManager } from "./managers/emails-manager";
import { EmailAdapter } from "./adapters/email-adapter";
import { AuthController } from "./controllers/AuthController";
import { RefreshTokenMiddleware } from "./middlewares/auth/refresh-token-middleware";
import { SecurityDevicesController } from "./controllers/SecurityDevicesController";
import { SecurityDevicesService } from "./domain/securityDevices-service";
import { TestController } from "./controllers/TestController";
import { ReactionsRepository } from "./repositories/reactions-db-repository";
import { ReactionsService } from "./domain/reactions-service";
import { Container } from "inversify";
import { ConfirmEmail } from "./middlewares/validation/auth-middleware/confirmEmail";
import { EmailResendingValidation } from "./middlewares/validation/auth-middleware/emailResendingValidation";
import { ConfirmRecoveryCode } from "./middlewares/validation/auth-middleware/recoveryCodeValidation";
import { EmailsService } from "./domain/emails-service";
import { LoginValidation } from "./middlewares/validation/users-middleware/loginValidation";
import { EmailRegistrationValidation } from "./middlewares/validation/users-middleware/emailRegistrationValidation";
import { BlogIdValidation } from "./middlewares/validation/posts-middleware/blogIdValidation";

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

export const container = new Container();
// Blogs
container.bind(BlogsRepository).toSelf();
container.bind(BlogsQueryRepository).toSelf();
container.bind(BlogsService).toSelf();
// Posts
container.bind(PostsRepository).toSelf();
container.bind(PostsQueryRepository).toSelf();
container.bind(PostsService).toSelf();
// Comments
container.bind(CommentsRepository).toSelf();
container.bind(CommentsQueryRepository).toSelf();
container.bind(CommentsService).toSelf();
// Email
container.bind(EmailAdapter).toSelf();
container.bind(EmailsManager).toSelf();
container.bind(EmailsService).toSelf();
// Users
container.bind(UsersRepository).toSelf();
container.bind(UsersQueryRepository).toSelf();
container.bind(UsersService).toSelf();
// Security Devices
container.bind(SessionRepository).toSelf();
container.bind(SecurityDevicesService).toSelf();
// Jwt
container.bind(JwtService).toSelf();
// Auth
container.bind(AuthService).toSelf();
// Reactions
container.bind(ReactionsRepository).toSelf();
container.bind(ReactionsService).toSelf();
// Middlewares
container.bind(JwtAuthMiddleware).toSelf();
container.bind(RefreshTokenMiddleware).toSelf();
container.bind(GetUserIdFromAccessToken).toSelf();
container.bind(ConfirmEmail).toSelf();
container.bind(EmailResendingValidation).toSelf();
container.bind(ConfirmRecoveryCode).toSelf();
container.bind(LoginValidation).toSelf();
container.bind(EmailRegistrationValidation).toSelf();
container.bind(BlogIdValidation).toSelf();
