import { UsersDBModel } from "../models/users-model/UsersDBModel";
import jwt from "jsonwebtoken";
import { settings } from "../settings";
import { UserAccountDBModel } from "../models/users-model/UserAccountDBModel";

export const jwtService = {
  async createJWT(user: UserAccountDBModel) {
    const token = jwt.sign({ userId: user.id }, settings.JWT_SECRET, {
      expiresIn: "10m",
    });
    return {
      accessToken: token,
    };
  },
  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET);
      return result.userId;
    } catch (error) {
      return null;
    }
  },
};
