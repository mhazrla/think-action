import { NextFunction, Request, Response } from "express";
import passport from "../../../config/passport";
import { AuthUserUseCase } from "../use-case/auth.use-case.js";
import { db } from "@src/database/database.js";

export const authLoginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUserUseCase = new AuthUserUseCase(db);

    const data = await authUserUseCase.login(req.body.googleId, req.body.password);
    res.cookie("token", data.token, { httpOnly: true });

    res.status(201).json({
      user: data.user,
      token: data.token,
    });
  } catch (error) {
    next(error);
  }
};

export const authRegisterController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();
    db.startTransaction();

    const authUserUseCase = new AuthUserUseCase(db);
    const data = await authUserUseCase.register(req.body, { session });
    await db.commitTransaction();

    res.status(201).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const authLogoutController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUserUseCase = new AuthUserUseCase(db);

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(400).json({ error: "Token missing" });
      return;
    }
    authUserUseCase.invalidateToken(token);
    res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    next(error);
  }
};

export const loginWithGoogle = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleCallback = passport.authenticate("google", {
  failureRedirect: "/",
});

export const profile = (req: Request, res: Response) => {
  if (req.user) {
    res.send(`Welcome,`);
  } else {
    res.redirect("/");
  }
};
