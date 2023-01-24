import { UserAccountDBModel } from "../models/users-model";
import { EmailsManager } from "../managers/emails-manager";

export class EmailsService {
  constructor(protected emailsManager: EmailsManager) {}
  async sendEmail(user: UserAccountDBModel) {
    await this.emailsManager.sendEmailConformationMessage(user);
  }
}
