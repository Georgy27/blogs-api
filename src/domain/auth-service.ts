import { usersQueryRepository } from "../repositories/users-db-query-repository";
import { usersService } from "./users-service";
import { emailsManager } from "../managers/emails-manager";
import { usersRepository } from "../repositories/users-db-repository";

export const authService = {
  async confirmEmail(code: string): Promise<boolean> {
    const user = await usersQueryRepository.findUserByConfirmationCode(code);
    if (!user) return false;
    const updatedConfirmation = await usersService.updateConfirmation(user.id);
    return updatedConfirmation;
  },
  async resendEmail(email: string) {
    const user = await usersQueryRepository.findByLoginOrEmail(email);
    if (!user) return false;
    const updatedConfirmationCode = await usersService.updateConfirmationCode(
      user.id
    );
    if (!updatedConfirmationCode) return false;
    try {
      await emailsManager.sendEmailConformationMessage(user);
    } catch (error) {
      console.log(error);
      // await usersRepository.deleteUser(user.id);
      return null;
    }
    return true;
  },
};
