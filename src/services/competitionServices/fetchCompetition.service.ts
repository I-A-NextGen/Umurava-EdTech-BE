import mongoose from "mongoose";
import Competition from "../../models/competition.model";
import { AppError } from "../../utils/errors.utils";

interface IFetchCompetition {
  page: number;
  limit: number;
  search?: string;
}

const formatDuration = (duration: string) => {
  const unit = duration.slice(-1);
  let value = parseInt(duration.slice(0, -1), 10);

  let formattedDuration = "";

  switch (unit) {
    case "d":
      formattedDuration = value + (value > 1 ? " Days" : " Day");
      break;
    case "w":
      formattedDuration = value + (value > 1 ? " Weeks" : " Week");
      break;
    case "h":
      formattedDuration = value + (value > 1 ? " Months" : " Month");
      break;
  }
  return formattedDuration;
};

export const fetchSingleCompetition = async (id: string) => {
  try {
    const competition = await Competition.findById(id).lean({ virtuals: true });

    if (!competition) {
      throw new AppError("fail", 404, "Competition not found.", true);
    }

    competition.duration = formatDuration(competition.duration);

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
