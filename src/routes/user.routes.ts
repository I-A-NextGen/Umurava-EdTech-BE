import { Router } from "express";
import { postLoginUser, postRegisterUser } from "../controllers/auth.controller";

const router = Router();

router.post("/register", postRegisterUser);
router.post("/login", postLoginUser);

export default router;
