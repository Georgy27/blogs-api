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
import { JwtAuthMiddleware } from "./middlewares/auth/jwt-auth-middleware";
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

const blogsRepository = new BlogsRepository();
export const blogsQueryRepository = new BlogsQueryRepository();
const blogsService = new BlogsService(blogsRepository);

const postsRepository = new PostsRepository();
const postsQueryRepository = new PostsQueryRepository();
const postsService = new PostsService(postsRepository, blogsQueryRepository);

const commentsRepository = new CommentsRepository();
const commentsQueryRepository = new CommentsQueryRepository();
const commentsService = new CommentsService(
  commentsRepository,
  postsQueryRepository,
  commentsQueryRepository
);
const emailAdapter = new EmailAdapter();
const emailsManager = new EmailsManager(emailAdapter);

const usersRepository = new UsersRepository();
export const usersQueryRepository = new UsersQueryRepository();
const usersService = new UsersService(
  usersRepository,
  usersQueryRepository,
  emailsManager
);

const sessionRepository = new SessionRepository();
const jwtService = new JwtService(sessionRepository);
const authService = new AuthService(
  usersService,
  jwtService,
  sessionRepository,
  usersQueryRepository,
  emailsManager
);
const securityDevicesService = new SecurityDevicesService(sessionRepository);

// middlewares
export const jwtAuthMiddleware = new JwtAuthMiddleware(
  usersQueryRepository,
  jwtService
);
export const refreshTokenMiddleware = new RefreshTokenMiddleware(
  jwtService,
  usersQueryRepository,
  sessionRepository
);

// controllers
export const blogsController = new BlogsController(
  blogsService,
  blogsQueryRepository,
  postsQueryRepository,
  postsService
);
export const postsController = new PostsController(
  postsService,
  postsQueryRepository,
  commentsService,
  commentsQueryRepository
);
export const usersController = new UsersController(
  usersService,
  usersQueryRepository
);
export const commentsController = new CommentsController(
  commentsService,
  commentsQueryRepository
);
export const authController = new AuthController(
  authService,
  usersService,
  sessionRepository
);
export const securityDeviceController = new SecurityDevicesController(
  sessionRepository,
  securityDevicesService
);
export const testController = new TestController(
  blogsRepository,
  postsRepository,
  usersRepository,
  commentsRepository
);
