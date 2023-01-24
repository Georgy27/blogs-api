import { EmailAdapter } from "../adapters/email-adapter";
import { UserAccountDBModel } from "../models/users-model";

export class EmailsManager {
  constructor(protected emailAdapter: EmailAdapter) {}
  async sendEmailConformationMessage(user: UserAccountDBModel) {
    let message = `<h1>Thank for your registration</h1><p>To finish registration please follow the link below: <a href='https://some-front.com/confirm-registration?code=${user.emailConfirmation.confirmationCode}'>complete registration</a> </p>`;
    await this.emailAdapter.sendEmail(user.accountData.email, message);
  }
  async sendPasswordRecoveryCode(user: UserAccountDBModel) {
    let message = `<h1>Thank for your registration</h1><p>To finish registration please follow the link below: <a href='https://some-front.com/password-recovery?recoveryCode=${user.passwordRecovery.recoveryCode}'>complete registration</a></p>`;
    await this.emailAdapter.sendEmail(user.accountData.email, message);
  }
}
