import { Router } from "express";
import * as controller from "./controller/index.js";
import { authMiddleware } from "@src/middleware/auth.middleware.js";

const router = Router();
router.get("/google", controller.loginWithGoogle);
router.get("/google/callback", controller.googleCallback, (req, res) => {
  res.redirect("/profile");
});
router.get("/profile", controller.profile);

router.get("/users", authMiddleware, controller.retrieveAllController);
router.get("/user/:username", authMiddleware, controller.retrieveController);
router.post("/register", controller.authRegisterController);
router.post("/login", controller.authLoginController);
router.post("/logout", authMiddleware, controller.authLogoutController);

export default router;
