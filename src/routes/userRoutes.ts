import { Router } from "express";
import { registerUser } from "../controllers/authController";

const router = Router();


router.post("/login");
router.post("/register", registerUser);


export default router;
