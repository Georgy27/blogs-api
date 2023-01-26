import { NextFunction, Request, Response } from "express";
import { UsersQueryRepository } from "../../repositories/users-db-query-repository";
import { JwtService } from "../../application/jwt-service";

export class JwtAuthMiddleware {
  constructor(
    protected usersQueryRepository: UsersQueryRepository,
    protected jwtService: JwtService
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    console.log("inside middleware");
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

export class GetUserIdFromAccessToken {
  constructor(
    protected usersQueryRepository: UsersQueryRepository,
    protected jwtService: JwtService
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
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
