export interface SessionsDBModel {
  ip: string;
  deviceName: string;
  lastActiveDate: string;
  deviceId: string;
  userId: string;
}
export interface SessionsViewModel {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
}
