import { UsersDBModel } from "../models/users-model/UsersDBModel";
import jwt from "jsonwebtoken";
import { settings } from "../settings";
import { UserAccountDBModel } from "../models/users-model/UserAccountDBModel";
import { userTokenCollection } from "../repositories/db";
import { tokenRepository } from "../repositories/token-db-repository";

export const jwtService = {
  async createJWT(userId: string) {
    const accessToken = jwt.sign({ userId }, settings.JWT_SECRET, {
      expiresIn: "10s",
    });
    const refreshToken = jwt.sign({ userId }, settings.JWT_REFRESH_SECRET, {
      expiresIn: "20s",
    });
    return {
      accessToken,
      refreshToken,
    };
  },
  async saveTokenToDB(userId: string, refreshToken: string) {
    const tokenData = await tokenRepository.saveRefreshToken(
      userId,
      refreshToken
    );
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
  async getUserIdByRefreshToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_REFRESH_SECRET);
      return result.userId;
    } catch (error) {
      return null;
    }
  },
};
