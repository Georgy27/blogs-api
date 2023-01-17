import mongoose, { Schema } from "mongoose";
import { SessionsDBModel } from "./index";

const SessionsSchema = new Schema<SessionsDBModel>(
  {
    ip: { type: String, required: true },
    deviceName: { type: String, required: true },
    lastActiveDate: { type: String, required: true },
    deviceId: { type: String, required: true },
    userId: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

export const SessionsModel = mongoose.model<SessionsDBModel>(
  "device-sessions",
  SessionsSchema
);
