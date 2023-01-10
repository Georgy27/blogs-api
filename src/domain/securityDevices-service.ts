import { jwtService } from "../application/jwt-service";
import { sessionRepository } from "../repositories/sessions-db-repository";

export const securityDevicesService = {
  async logOutDevices(deviceId: string, userId: string) {
    return sessionRepository.deleteAllSessionsExceptCurrent(deviceId, userId);
  },
  async logOutDevice(deviceId: string, userId: string) {
    // find device
    const device = await sessionRepository.findDeviceById(deviceId);
    if (!device) return 404;
    // check for user
    if (device.userId !== userId) return 403;
    return sessionRepository.deleteSessionByDeviceID(deviceId, userId);
  },
};
