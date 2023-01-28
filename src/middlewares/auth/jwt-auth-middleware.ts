import { NextFunction, Request, Response } from "express";
import { UsersQueryRepository } from "../../repositories/users-db-query-repository";
import { JwtService } from "../../application/jwt-service";
import { inject, injectable } from "inversify";

@injectable()
export class JwtAuthMiddleware {
  constructor(
    @inject(UsersQueryRepository)
    protected usersQueryRepository: UsersQueryRepository,
    @inject(JwtService) protected jwtService: JwtService
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    if (!auth) return res.sendStatus(401);
    const authType = auth.split(" ")[0];
    const token = auth.split(" ")[1];

    if (authType !== "Bearer") return res.sendStatus(401);

    const userId = await this.jwtService.getUserIdByAccessToken(token);

    if (!userId) return res.sendStatus(401);
    req.user = await this.usersQueryRepository.findUserById(userId);

    return next();
  }
}
@injectable()
export class GetUserIdFromAccessToken {
  constructor(
    @inject(UsersQueryRepository)
    protected usersQueryRepository: UsersQueryRepository,
    @inject(JwtService) protected jwtService: JwtService
  ) {}
  async use(
    req: Request<any, any, any, any>,
    res: Response,
    next: NextFunction
  ) {
    const auth = req.headers.authorization;
    if (!auth) {
      req.user = null;
      return next();
    }
    const token = auth.split(" ")[1];
    const userId = await this.jwtService.getUserIdByAccessToken(token);

    if (!userId) {
      req.user = null;
      return next();
    }
    req.user = await this.usersQueryRepository.findUserById(userId);
    return next();
  }
}
