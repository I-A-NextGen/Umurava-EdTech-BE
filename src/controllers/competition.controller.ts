import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.utils";
import {
  getCompetitionsSchema,
  postCompetitionSchema,
  putCompetitionSchema,
} from "../validators/competition.validators";
import createNewCompetition from "../services/competitionServices/createCompetition.service";
import { successResponse } from "../utils/responses.utils";
import {
  fetchAllCompetitions,
  fetchSingleCompetition,
} from "../services/competitionServices/fetchCompetition.service";
import { updateCompetition } from "../services/competitionServices/updateCompetition.service";
import mongoose from "mongoose";
import { softDeleteCompetition } from "../services/competitionServices/deleteCompetition.service";
import { saveCompetitionApplication } from "../services/competitionServices/applyCompetition.service";
import { fetchParticipants } from "../services/competitionServices/fetchParticipants.service";
import Competition from "../models/competition.model";
import User, { UserRoles } from "../models/user.model";
import moment from "moment";
import { calcStats } from "../services/competitionServices/calcStats.service";

// Create new competitions
export const postCompetition = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = postCompetitionSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) throw error;

    if (!req.user) {
      throw new AppError("fail", 401, "Unauthorized: No user found.", true);
    }

    const competition = await createNewCompetition({
      ...req.body,
      creator: req.user.id,
    });

    successResponse(res, 201, "Competition created successful.", {
      competition,
    } as unknown as Record<string, object>);

    return;
  } catch (error) {
    next(error);
  }
};

// Fetch all competitions
export const getCompetitions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = req.query.page || "1";
    const limit = req.query.limit || "40";
    const search = req.query.search;

    const { error } = getCompetitionsSchema.validate(
      { page, limit },
      { abortEarly: false }
    );

    if (error) throw error;

    const competitions = await fetchAllCompetitions({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      search: search as string,
    });

    successResponse(res, 200, "Competitions retrieved successful.", {
      ...competitions,
    } as unknown as Record<string, object>);
  } catch (error) {
    next(error);
  }
};

// Fetch single competition
export const getSingleCompetition = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const competitionId = req.params.id;

    if (!competitionId) {
      throw new AppError("fail", 400, "No competition id provided", true);
    }
    const competition = await fetchSingleCompetition(competitionId);

    successResponse(res, 200, "Competition retrieved successful.", {
      competition,
    } as unknown as Record<string, object>);

    return;
  } catch (error) {
    next(error);
  }
};

// Update single competition
export const putCompetition = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const competitionId = req.params.id;

    if (!req.user) {
      throw new AppError("fail", 401, "Unauthorized: No user found.", true);
    }

    if (!competitionId) {
      throw new AppError("fail", 400, "No competition id provided", true);
    }

    const { error } = putCompetitionSchema.validate(req.body);

    if (error) throw error;

    const competition = await updateCompetition(
      req.user.id,
      competitionId,
      req.body
    );

    successResponse(res, 200, "Competition updated successfully.", {
      competition,
    } as unknown as Record<string, object>);

    return;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(
        new AppError("fail", 404, `Competition not found,`, true, error.message)
      );
    } else {
      next(error);
    }
  }
};

// Delete single competition
export const deleteCompetition = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const competitionId = req.params.id;

    if (!req.user) {
      throw new AppError("fail", 401, "Unauthorized: No user found.", true);
    }

    if (!competitionId) {
      throw new AppError("fail", 400, "No competition id provided", true);
    }

    const isDeleted = await softDeleteCompetition(
      req.user.id,
      competitionId,
      req.body
    );

    if (!isDeleted) {
      throw new AppError("error", 500, "Competition deletion failed.", false);
    }

    successResponse(res, 200, "Competition deleted successfully.", undefined);

    return;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(
        new AppError("fail", 404, `Competition not found,`, true, error.message)
      );
    } else {
      next(error);
    }
  }
};

//Apply to a competition
export const postApplyCompetition = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const competitionId = req.params.id;

    if (!req.user) {
      throw new AppError("fail", 401, "Unauthorized: No user found.", true);
    }

    if (!competitionId) {
      throw new AppError("fail", 400, "No competition id provided", true);
    }

    await saveCompetitionApplication(req.user.id, competitionId);

    successResponse(res, 201, "Application submitted successfully!", undefined);

    return;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(
        new AppError("fail", 404, `Competition not found,`, true, error.message)
      );
    } else {
      next(error);
    }
  }
};

// Get competition participants

export const getCompetitionParticipants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const competitionId = req.params.id;

    if (!req.user) {
      throw new AppError("fail", 401, "Unauthorized: No user found.", true);
    }

    if (!competitionId) {
      throw new AppError("fail", 400, "No competition id provided", true);
    }

    const participants = await fetchParticipants(
      req.user,
      competitionId as string
    );
    successResponse(res, 200, "Participants retrieved successful.", {
      participants,
    });
    return;
  } catch (error) {
    next(error);
  }
};

// metrics

const getDateFilter = (filter: string) => {
  const now = moment.utc();
  let startDate, endDate;

  switch (filter) {
    case "week":
      startDate = new Date(now.startOf("week").format());
      endDate = new Date(now.endOf("week").format());
      break;
    case "month":
      startDate = new Date(now.startOf("month").format());
      endDate = new Date(now.endOf("month").format());
      break;
    case "year":
      startDate = new Date(now.startOf("year").format());
      endDate = new Date(now.endOf("year").format());
      break;
    default:
      return {};
  }

  return { createdAt: { $gte: startDate, $lte: endDate } };
};

export const getTotalCompetitions = async (req: Request, res: Response) => {
  try {
    const dateFilter = getDateFilter(req.query.filter as string);

    const filterQuery: any = {
      $or: [{ "deleted.isDeleted": false }, { "deleted.isDeleted": null }],
      ...dateFilter,
    };

    console.log("Generated Query:", JSON.stringify(filterQuery, null, 2));

    const competitions = await Competition.find(filterQuery);

    res.json({ totalCompetitions: competitions.length, competitions });
  } catch (error: any) {
    console.error("Error fetching competitions:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const getCompetitionsByStatus = async (
  req: Request,
  res: Response,
  status: string
) => {
  try {
    const dateFilter = getDateFilter(req.query.filter as string);

    const filterQuery: any = {
      $or: [{ "deleted.isDeleted": false }, { "deleted.isDeleted": null }],
      ...dateFilter,
    };

    console.log("Generated Query:", JSON.stringify(filterQuery, null, 2));

    const competitions = await Competition.find(filterQuery).lean({
      virtuals: true,
    });

    const filteredCompetitions = competitions.filter(
      (comp) => comp.status === status
    );

    res.json({
      status,
      count: filteredCompetitions.length,
      competitions: filteredCompetitions,
    });
  } catch (error: any) {
    console.error("Error fetching competitions by status:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const getTotalTalents = async (req: Request, res: Response) => {
  try {
    const dateFilter = getDateFilter(req.query.filter as string);

    const filterQuery: any = {
      role: UserRoles.TALENT,
      ...dateFilter,
    };

    console.log("Generated Query:", JSON.stringify(filterQuery, null, 2));

    const talents = await User.find(filterQuery);

    res.json({ totalTalents: talents.length, talents });
  } catch (error: any) {
    console.error("Error fetching total talents:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const getCompetitionsStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError("fail", 401, "Unauthorized: No user found.", true);
    }

    const stats = await calcStats(req.user);

    successResponse(
      res,
      200,
      "Competition stats retrieved successfully",
      stats
    );
  } catch (error) {
    next(error);
  }
};
