import mongoose, { Schema } from "mongoose";
import { UserAccountDBModel } from "./index";

const UsersSchema = new Schema<UserAccountDBModel>(
  {
    id: { type: String, required: true, unique: true },
    accountData: {
      login: { type: String, required: true },
      email: { type: String, required: true },
      passwordHash: { type: String, required: true },
      createdAt: { type: String, required: true },
    },
    emailConfirmation: {
      confirmationCode: { type: String, required: true },
      expirationDate: { type: String, required: true },
      isConfirmed: { type: Boolean, required: true },
    },
  },
  {
    versionKey: false,
  }
);

export const UsersModel = mongoose.model<UserAccountDBModel>(
  "users",
  UsersSchema
);
