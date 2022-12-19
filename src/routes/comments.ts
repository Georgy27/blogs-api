import { Request, Response, Router } from "express";

export const commentsRouter = Router({});

// routes

commentsRouter.get("/:id", async (req: Request, res: Response) => {});
commentsRouter.put("/:commentId", async (req: Request, res: Response) => {});
commentsRouter.delete("/:commentId", async (req: Request, res: Response) => {});
