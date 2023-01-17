export type CreateUserModel = {
  login: string;
  password: string;
  email: string;
};
export type QueryUserModel = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string | undefined;
  searchLoginTerm: string | undefined | null;
  searchEmailTerm: string | undefined | null;
};
export type UserAccountDBModel = {
  id: string;
  accountData: {
    login: string;
    email: string;
    passwordHash: string;
    createdAt: string;
  };
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: string;
    isConfirmed: boolean;
  };
};

export interface UsersViewModel {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}
