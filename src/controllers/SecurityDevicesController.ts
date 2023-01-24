import { Request, Response } from "express";
import { SessionRepository } from "../repositories/sessions-db-repository";
import { SecurityDevicesService } from "../domain/securityDevices-service";
import { RequestWithParams } from "../types";

export class SecurityDevicesController {
  constructor(
    protected sessionRepository: SessionRepository,
    protected securityDevicesService: SecurityDevicesService
  ) {}
  async getAllDevicesWithActiveSession(req: Request, res: Response) {
    const userId = req.user!.userId;
    const devices = await this.sessionRepository.findAllActiveSessions(userId);
    return res.status(200).send(devices);
  }
  async deleteAllDevicesSessionsButActive(req: Request, res: Response) {
    const userId = req.user!.userId;
    const deviceId = req.jwtPayload.deviceId;
    const terminateDevices = await this.securityDevicesService.logOutDevices(
      deviceId,
      userId
    );
    return res.sendStatus(204);
  }
  async deleteDeviceSessionById(
    req: RequestWithParams<{ deviceId: string }>,
    res: Response
  ) {
    const deviceId = req.params.deviceId;
    const userId = req.user!.userId;
    const result = await this.securityDevicesService.logOutDevice(
      deviceId,
      userId
    );
    if (result === 403) return res.sendStatus(403);
    if (result === 404) return res.sendStatus(404);
    return res.sendStatus(204);
  }
}
