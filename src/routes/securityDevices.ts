import { Request, Response, Router, NextFunction } from "express";
import { refreshTokenMiddleware } from "../middlewares/auth/refresh-token-middleware";
import { sessionRepository } from "../repositories/sessions-db-repository";
import { securityDevicesService } from "../domain/securityDevices-service";
import { RequestWithParams } from "../types";

export const securityDevicesRouter = Router({});

securityDevicesRouter.get(
  "/",
  refreshTokenMiddleware,
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const devices = await sessionRepository.findAllActiveSessions(userId);
    return res.status(200).send(devices);
  }
);
securityDevicesRouter.delete(
  "/",
  refreshTokenMiddleware,
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const deviceId = req.jwtPayload.deviceId;
    const terminateDevices = await securityDevicesService.logOutDevices(
      deviceId,
      userId
    );
    return res.sendStatus(204);
  }
);
securityDevicesRouter.delete(
  "/:deviceId",
  refreshTokenMiddleware,
  async (req: RequestWithParams<{ deviceId: string }>, res: Response) => {
    const deviceId = req.params.deviceId;
    const userId = req.user!.userId;
    const result = await securityDevicesService.logOutDevice(deviceId, userId);
    if (result === 403) return res.sendStatus(403);
    if (result === 404) return res.sendStatus(404);
    return res.sendStatus(204);
  }
);
