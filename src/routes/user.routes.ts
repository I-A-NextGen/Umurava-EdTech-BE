import { Router } from "express";
import { postLoginUser, postRegisterUser,getUserProfile } from "../controllers/auth.controller";
import authenticate from "../middleware/auth.middleware";

const router = Router();

router.post("/register", postRegisterUser);
router.post("/login", postLoginUser);
router.get("/profile", authenticate, getUserProfile);

export default router;
