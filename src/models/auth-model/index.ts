export type AuthIPModel = {
  ip: string;
  path: string;
  connectionAt: string;
};
export type AuthRegistrationModel = {
  login: string;
  password: string;
  email: string;
};
export type AuthUserModel = {
  loginOrEmail: string;
  password: string;
};
export type AuthViewModel = {
  email: string;
  login: string;
  userId: string;
};
