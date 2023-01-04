import { userTokenCollection } from "./db";

export const tokenRepository = {
  async saveRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<boolean> {
    try {
      await userTokenCollection.updateOne(
        { userId },
        { $set: { refreshToken } },
        {
          upsert: true,
        }
      );
      return true;
    } catch (error) {
      return false;
    }
  },
  async findTokenByUserId(userId: string, refreshToken: string) {
    return userTokenCollection.findOne({ userId, refreshToken });
  },
  async deleteRefreshToken(userId: string): Promise<boolean> {
    const deletedToken = await userTokenCollection.deleteOne({ userId });
    return deletedToken.deletedCount === 1;
  },
};
