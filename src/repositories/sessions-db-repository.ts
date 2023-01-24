import { SessionsDBModel, SessionsViewModel } from "../models/sessions-model";
import { SessionsModel } from "../models/sessions-model/session-schema";

export class SessionRepository {
  async saveNewSession(tokenData: SessionsDBModel) {
    return SessionsModel.create({ ...tokenData });
  }
  async findAllActiveSessions(userId: string): Promise<SessionsViewModel[]> {
    const devices = await SessionsModel.find({ userId }, { _id: false }).lean();
    const newDevices = devices.map((device) => {
      return {
        ip: device.ip,
        title: device.deviceName,
        lastActiveDate: device.lastActiveDate,
        deviceId: device.deviceId,
      };
    });
    return newDevices;
  }
  async findLastActiveDate(userId: string, lastActiveDate: string) {
    return SessionsModel.findOne({ userId, lastActiveDate });
  }
  async updateLastActiveDate(deviceId: string, lastActiveDate: string) {
    const result = await SessionsModel.updateOne(
      { deviceId },
      { lastActiveDate }
    );
    return result.matchedCount === 1;
  }
  async findDeviceById(deviceId: string): Promise<SessionsDBModel | null> {
    return SessionsModel.findOne({ deviceId });
  }
  async deleteSessionByDeviceID(
    deviceId: string,
    userId: string
  ): Promise<boolean> {
    const deletedToken = await SessionsModel.deleteOne({
      userId,
      deviceId,
    });
    return deletedToken.deletedCount === 1;
  }
  async deleteAllSessionsExceptCurrent(deviceId: string, userId: string) {
    return SessionsModel.deleteMany({
      userId,
      deviceId: { $ne: deviceId },
    });
  }
}
