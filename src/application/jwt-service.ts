import jwt from "jsonwebtoken";
import { settings } from "../settings";
import { sessionRepository } from "../repositories/sessions-db-repository";
import { randomUUID } from "crypto";

export const jwtService = {
  async createJWT(userId: string, deviceId: string) {
    const accessToken = jwt.sign({ userId }, settings.JWT_SECRET, {
      expiresIn: "10s",
    });
    const refreshToken = jwt.sign(
      { deviceId, userId },
      settings.JWT_REFRESH_SECRET,
      {
        expiresIn: "20s",
      }
    );

    return {
      accessToken,
      refreshToken,
    };
  },
  async getIssuedAtByRefreshToken(refreshToken: string) {
    const refreshTokenDecoded: any = jwt.decode(refreshToken);
    const issuedAt = new Date(refreshTokenDecoded.iat * 1000).toISOString();
    return issuedAt;
  },
  async saveTokenToDB(
    ip: string,
    deviceName: string,
    issuedAt: string,
    deviceId: string,
    userId: string
  ) {
    const tokenData = {
      ip,
      deviceName,
      lastActiveDate: issuedAt,
      deviceId,
      userId,
    };
    await sessionRepository.saveNewSession(tokenData);
    return tokenData;
  },
  async getUserIdByAccessToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET);
      return result.userId;
    } catch (error) {
      return null;
    }
  },
  async getJWTPayloadByRefreshToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_REFRESH_SECRET);
      return result;
    } catch (error) {
      return null;
    }
  },
};
