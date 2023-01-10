import { NextFunction, Request, Response } from "express";
import { jwtService } from "../../application/jwt-service";
import { usersQueryRepository } from "../../repositories/users-db-query-repository";
import { sessionRepository } from "../../repositories/sessions-db-repository";

export const refreshTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.sendStatus(401);
  const jwtPayload = await jwtService.getJWTPayloadByRefreshToken(refreshToken);
  if (!jwtPayload.userId) return res.sendStatus(401);
  // check if user exists
  const user = await usersQueryRepository.findUserById(jwtPayload.userId);
  if (!user) return res.sendStatus(401);
  const issuedAt = await jwtService.getIssuedAtByRefreshToken(refreshToken);
  // check if the token expired
  const lastActiveDate = await sessionRepository.findLastActiveDate(
    user.userId,
    issuedAt
  );
  if (!lastActiveDate) return res.sendStatus(401);

  req.user = user;
  req.jwtPayload = jwtPayload;
  return next();
};
