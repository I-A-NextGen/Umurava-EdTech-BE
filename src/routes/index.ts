import { Router, Request, Response } from "express";
import userRoutes from "./user.routes";
const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "This is API health testing endpoint, it is running smoothly",
  });
  return;
});
router.use("/user", userRoutes);

export default router;
