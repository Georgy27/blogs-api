import { NextFunction, Request, Response } from "express";
import { AuthIPModel } from "../../models/auth-model";

const memoryRequests: AuthIPModel[] = [];

export const checkRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const blockTimeOut = 10 * 1000;
  const connectionsLimit = 5;
  const path = req.path;
  const ip = req.ip;
  const connectionAt = Date.now().toString();

  memoryRequests.push({ ip, path, connectionAt });

  const connectionsCount = memoryRequests.filter(
    (r) =>
      r.ip === ip &&
      r.path === path &&
      +connectionAt - +r.connectionAt <= blockTimeOut
  ).length;

  if (connectionsCount > connectionsLimit) return res.sendStatus(429);
  return next();
};

// const requests = await connDb.countDocuments({
//   ip,
//   path,
//   date: { $gte: addSeconds(connectionAt, -blockTimeOut).toISOString() },
// });
