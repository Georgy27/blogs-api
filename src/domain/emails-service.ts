import { UserAccountDBModel } from "../models/users-model";
import { EmailsManager } from "../managers/emails-manager";
import { inject, injectable } from "inversify";

@injectable()
export class EmailsService {
  constructor(@inject(EmailsManager) protected emailsManager: EmailsManager) {}
  async sendEmail(user: UserAccountDBModel) {
    await this.emailsManager.sendEmailConformationMessage(user);
  }
}
