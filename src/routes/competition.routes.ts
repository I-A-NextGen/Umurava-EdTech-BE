import { Router } from "express";
import authenticate from "../middleware/auth.middleware";
import {
  deleteCompetition,
  getCompetitionsStats,
  getCompetitionParticipants,
  getCompetitions,
  getSingleCompetition,
  postApplyCompetition,
  postCompetition,
  putCompetition,
} from "../controllers/competition.controller";
import authorize from "../middleware/rbac.middleware";
import { UserRoles } from "../models/user.model";
import { getTotalCompetitions, getCompetitionsByStatus, getTotalTalents } from '../controllers/competition.controller';

const router = Router();

// metrics

router.get('/total', authenticate, authorize(UserRoles.ADMIN), getTotalCompetitions);
router.get('/status/completed', authenticate, authorize(UserRoles.ADMIN), (req, res) => getCompetitionsByStatus(req, res, 'completed'));
router.get('/status/open', authenticate, authorize(UserRoles.ADMIN), (req, res) => getCompetitionsByStatus(req, res, 'open'));
router.get('/status/ongoing', authenticate, authorize(UserRoles.ADMIN), (req, res) => getCompetitionsByStatus(req, res, 'ongoing'));
router.get('/users/talent', authenticate, authorize(UserRoles.ADMIN), getTotalTalents);

// Get All Stats
router.get('/stats', authenticate, getCompetitionsStats);

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

// Post apply competition
router.post(
  "/:id/apply",
  authenticate,
  authorize(UserRoles.TALENT),
  postApplyCompetition
);

// Get competition participants
router.get(
  "/:id/participants",
  authenticate,
  authorize(UserRoles.CLIENT, UserRoles.ADMIN),
  getCompetitionParticipants
);



export default router;
