import { NextFunction, Request, Response } from "express";
import { RetrieveAllUserUseCase } from "../use-case/retrieve-all.use-case.js";
import { QueryInterface } from "@src/database/connection.js";
import { db } from "@src/database/database.js";

export const retrieveAllController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createUserUseCase = new RetrieveAllUserUseCase(db);

    const result = await createUserUseCase.handle(req.query as unknown as QueryInterface);

    res.status(200).json({
      user: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};
