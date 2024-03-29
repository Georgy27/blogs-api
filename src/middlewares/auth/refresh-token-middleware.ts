import { NextFunction, Request, Response } from "express";
import { JwtService } from "../../application/jwt-service";
import { UsersQueryRepository } from "../../repositories/users-db-query-repository";
import { SessionRepository } from "../../repositories/sessions-db-repository";
import { inject, injectable } from "inversify";

@injectable()
export class RefreshTokenMiddleware {
  constructor(
    @inject(JwtService) protected jwtService: JwtService,
    @inject(UsersQueryRepository)
    protected usersQueryRepository: UsersQueryRepository,
    @inject(SessionRepository) protected sessionRepository: SessionRepository
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.sendStatus(401);
    const jwtPayload = await this.jwtService.getJWTPayloadByRefreshToken(
      refreshToken
    );
    if (!jwtPayload.userId) return res.sendStatus(401);
    // check if user exists
    const user = await this.usersQueryRepository.findUserById(
      jwtPayload.userId
    );
    if (!user) return res.sendStatus(401);
    const issuedAt = await this.jwtService.getIssuedAtByRefreshToken(
      refreshToken
    );
    // check if the token expired
    const lastActiveDate = await this.sessionRepository.findLastActiveDate(
      user.userId,
      issuedAt
    );
    if (!lastActiveDate) return res.sendStatus(401);

    req.user = user;
    req.jwtPayload = jwtPayload;
    return next();
  }
}
