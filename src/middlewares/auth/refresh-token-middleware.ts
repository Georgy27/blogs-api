import { NextFunction, Request, Response } from "express";
import { jwtService } from "../../application/jwt-service";
import { usersQueryRepository } from "../../repositories/users-db-query-repository";
import { tokenRepository } from "../../repositories/token-db-repository";

export const refreshTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.sendStatus(401);
  const userId = await jwtService.getUserIdByRefreshToken(refreshToken);
  if (!userId) return res.sendStatus(401);
  // check is user exists
  const user = await usersQueryRepository.findUserById(userId);
  if (!user) return res.sendStatus(401);
  const checkRefreshTokenInDb = await tokenRepository.findTokenByUserId(
    userId,
    refreshToken
  );
  if (!checkRefreshTokenInDb) return res.sendStatus(401);
  req.user = user;
  return next();
};
