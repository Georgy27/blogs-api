import { Request } from "express";
import { AuthViewModel } from "../models/auth-model";

export type RequestWithBody<T> = Request<{}, {}, T>;
export type RequestWithQuery<T> = Request<{}, {}, {}, T>;
export type RequestWithParams<T> = Request<T>;
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>;
export type RequestWithParamsAndQuery<T, Q> = Request<T, {}, {}, Q>;

declare global {
  declare namespace Express {
    export interface Request {
      user: AuthViewModel | null;
      jwtPayload: any;
    }
  }
}
