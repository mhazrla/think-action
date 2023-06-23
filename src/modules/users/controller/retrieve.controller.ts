import { NextFunction, Request, Response } from "express";
import { RetrieveUserUseCase } from "../use-case/retrieve.use-case.js";
import { db } from "@src/database/database.js";

export const retrieveController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const retrieveUserUseCase = new RetrieveUserUseCase(db);
    const result = await retrieveUserUseCase.handle(req.params.username);

    res.status(200).json({
      username: result.username,
      email: result.email,
      role: result.role,
      createdAt: result.createdAt,
    });
  } catch (error) {
    next(error);
  }
};
