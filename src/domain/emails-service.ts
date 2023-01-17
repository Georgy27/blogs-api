import { emailsManager } from "../managers/emails-manager";
import { UserAccountDBModel } from "../models/users-model";

export const emailsService = {
  async sendEmail(user: UserAccountDBModel) {
    await emailsManager.sendEmailConformationMessage(user);
  },
};
