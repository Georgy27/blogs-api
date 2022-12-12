import { query } from "express-validator";

export const pageNumberValidation = query("pageNumber").toInt().default(1);
export const pageSize = query("pageSize").toInt().default(10);
export const sortBy = query("sortBy").default("createdAt");
