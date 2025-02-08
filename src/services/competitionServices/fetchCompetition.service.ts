import mongoose from "mongoose";
import Competition from "../../models/competition.model";
import { AppError } from "../../utils/errors.utils";

interface IFetchCompetition {
  page: number;
  limit: number;
  search?: string;
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

export const fetchAllCompetitions = async ({
  page,
  limit,
  search,
}: IFetchCompetition) => {
  const totalCompetitions = await Competition.countDocuments({
    $or: [{ "deleted.isDeleted": false }, { "deleted.isDeleted": null }],
  });

  const offset = (page - 1) * limit;

  const searchQuery = search
    ? search
        .split(" ")
        .map((word) => ({ title: { $regex: word, $options: "i" } }))
    : [];

  const competitions = await Competition.find(
    searchQuery.length ? { $and: searchQuery } : {}
  )
    .skip(offset)
    .limit(limit)
    .lean({ virtuals: true });
  

  return { totalCompetitions, competitions };
};
