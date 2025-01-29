import { Router } from "express";
import authenticate from "../middleware/auth.middleware";
import {
  deleteCompetition,
  getCompetitions,
  getSingleCompetition,
  postCompetition,
  putCompetition,
} from "../controllers/competition.controller";
import authorize from "../middleware/rbac.middleware";
import { UserRoles } from "../models/user.model";

const router = Router();

// Create new competition
router.post(
  "/",
  authenticate,
  authorize(UserRoles.ADMIN, UserRoles.CLIENT),
  postCompetition
);

// Fetch all competitions
router.get("/", getCompetitions);

// Fetch single competition
router.get("/:id", getSingleCompetition);

// Update a competition
router.put(
  "/:id",
  authenticate,
  authorize(UserRoles.CLIENT, UserRoles.ADMIN),
  putCompetition
);

// Delete a competition
router.delete(
  "/:id",
  authenticate,
  authorize(UserRoles.CLIENT, UserRoles.ADMIN),
  deleteCompetition
);

export default router;
