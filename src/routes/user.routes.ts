import { Router } from "express";
import { registerUser } from "../controllers/authController";

const router = Router();

router.get("/");
router.post("/register", registerUser);

export default router;
