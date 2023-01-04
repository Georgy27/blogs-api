import { NextFunction, Request, Response } from "express";
import { jwtService } from "../../application/jwt-service";
import { usersQueryRepository } from "../../repositories/users-db-query-repository";

export const jwtAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;
  if (!auth) return res.sendStatus(401);
  const authType = auth.split(" ")[0];
  const token = auth.split(" ")[1];

  if (authType !== "Bearer") return res.sendStatus(401);

  const userId = await jwtService.getUserIdByAccessToken(token);

  if (!userId) return res.sendStatus(401);
  req.user = await usersQueryRepository.findUserById(userId);
  return next();
};
