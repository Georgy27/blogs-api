import { blogsCollection, refreshTokensMetaCollection } from "./db";
import jwt from "jsonwebtoken";
import { SessionsDBModel } from "../models/token-model/SessionsDBModel";
import { SessionsViewModel } from "../models/token-model/SessionsViewModel";

export const sessionRepository = {
  async saveNewSession(tokenData: SessionsDBModel) {
    return refreshTokensMetaCollection.insertOne({ ...tokenData });
  },
  async findAllActiveSessions(userId: string): Promise<SessionsViewModel[]> {
    const devices = await refreshTokensMetaCollection
      .find({ userId }, { projection: { _id: false } })
      .toArray();
    const newDevices = devices.map((device) => {
      return {
        ip: device.ip,
        title: device.deviceName,
        lastActiveDate: device.lastActiveDate,
        deviceId: device.deviceId,
      };
    });
    return newDevices;
  },
  async findLastActiveDate(userId: string, lastActiveDate: string) {
    return refreshTokensMetaCollection.findOne({ userId, lastActiveDate });
  },
  async updateLastActiveDate(deviceId: string, lastActiveDate: string) {
    const result = await refreshTokensMetaCollection.updateOne(
      { deviceId },
      {
        $set: { lastActiveDate },
      }
    );
    return result.matchedCount === 1;
  },
  async findDeviceById(deviceId: string): Promise<SessionsDBModel | null> {
    return refreshTokensMetaCollection.findOne({ deviceId });
  },
  async deleteSessionByDeviceID(
    deviceId: string,
    userId: string
  ): Promise<boolean> {
    const deletedToken = await refreshTokensMetaCollection.deleteOne({
      userId,
      deviceId,
    });
    return deletedToken.deletedCount === 1;
  },
  async deleteAllSessionsExceptCurrent(deviceId: string, userId: string) {
    return refreshTokensMetaCollection.deleteMany({
      userId,
      deviceId: { $ne: deviceId },
    });
  },
};
