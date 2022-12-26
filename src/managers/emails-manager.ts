import { emailAdapter } from "../adapters/email-adapter";
import { UserAccountDBModel } from "../models/users-model/UserAccountDBModel";

export const emailsManager = {
  async sendEmailConformationMessage(user: UserAccountDBModel) {
    console.log(`Email Manager ${user.emailConfirmation.confirmationCode}`);
    let message = `<h1>Thank for your registration</h1><p>To finish registration please follow the link below: <a href='https://some-front.com/confirm-registration?code=${user.emailConfirmation.confirmationCode}'>complete registration</a> </p>`;
    await emailAdapter.sendEmail(user.accountData.email, message);
  },
};
