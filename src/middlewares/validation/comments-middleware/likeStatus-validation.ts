import { body } from "express-validator";
const values = ["Like", "Dislike", "None"];
export const likeStatusValidation = body("likeStatus").notEmpty().isIn(values);
