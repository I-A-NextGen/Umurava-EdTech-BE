import mongoose from "mongoose";
import Competition from "../../models/competition.model";
import { AppError } from "../../utils/errors.utils";

interface Pagination {
  page: number;
  limit: number;
}

export const fetchSingleCompetition = async (id: string) => {
  try {
    const competition = await Competition.findById(id).lean({ virtuals: true });

    if (!competition) {
      throw new AppError("fail", 404, "Competition not found.", true);
    }

    return competition;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw new AppError(
        "fail",
        404,
        `Competition not found,`,
        true,
        error.message
      );
    }
    throw error;
  }
};

export const fetchAllCompetitions = async ({ page, limit }: Pagination) => {
  const totalCompetitions = await Competition.countDocuments({
    $or: [{ "deleted.isDeleted": false }, { "deleted.isDeleted": null }],
  });

  const offset = (page - 1) * limit;

  const competitions = await Competition.find()
    .skip(offset)
    .limit(limit)
    .lean({ virtuals: true });

  return { totalCompetitions, competitions };
};
