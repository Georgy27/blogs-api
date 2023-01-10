import { NextFunction, Request, Response } from "express";
import { AuthIPModel } from "../../models/auth-model/AuthIPModel";

const memoryRequests: AuthIPModel[] = [];

export const checkRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const blockTimeOut = 10 * 1000;
  // const connectionsLimit = 5;
  // const connectionAt = +new Date();
  const path = req.path;
  const ip = req.ip;
  const connectionsCount = memoryRequests.filter(
    (r) => r.ip === ip && r.path === path
  );
  const currentDate = new Date().toISOString();
  const requestsNumber = connectionsCount.filter(
    (r) => +currentDate - +r.date <= 10 * 1000
  );
  if (requestsNumber.length > 5) {
    return res.sendStatus(429);
  }
  memoryRequests.push({ ip, path, date: currentDate });

  next();
};

// const requests = await connDb.countDocuments({
//   ip,
//   path,
//   date: { $gte: addSeconds(connectionAt, -blockTimeOut).toISOString() },
// });
