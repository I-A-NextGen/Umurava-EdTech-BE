import { Router, Request, Response } from "express";
import userRoutes from "./user.routes";
import competitionRoutes from "./competition.routes";
import notificationRoutes from "../routes/notificationRoutes";
import swaggerUI from "swagger-ui-express";
import swaggerDocs from "../configs/swagger";
import fs from "fs";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "This is API health testing endpoint, it is running smoothly",
  });
  return;
});

router.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocs, {
    explorer: true,
    customCss: `${fs.readFileSync("src/docs/themes/theme-flattop.css")}`,
  })
);

router.use("/user", userRoutes);

router.use("/competitions", competitionRoutes);
router.use("/notification", notificationRoutes);

export default router;
