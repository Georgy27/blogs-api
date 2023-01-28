import { SessionRepository } from "../repositories/sessions-db-repository";
import { inject, injectable } from "inversify";

@injectable()
export class SecurityDevicesService {
  constructor(
    @inject(SessionRepository) protected sessionRepository: SessionRepository
  ) {}
  async logOutDevices(deviceId: string, userId: string) {
    return this.sessionRepository.deleteAllSessionsExceptCurrent(
      deviceId,
      userId
    );
  }
  async logOutDevice(deviceId: string, userId: string) {
    // find device
    const device = await this.sessionRepository.findDeviceById(deviceId);
    if (!device) return 404;
    // check for user
    if (device.userId !== userId) return 403;
    return this.sessionRepository.deleteSessionByDeviceID(deviceId, userId);
  }
}
