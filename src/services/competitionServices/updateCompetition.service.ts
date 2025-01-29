import mongoose from "mongoose";
import Competition from "../../models/competition.model";
import { ICompetitionInputs } from "./createCompetition.service";
import { AppError } from "../../utils/errors.utils";

export const updateCompetition = async (
  userId: string,
  competitionId: string,
  competitionInputs: Partial<ICompetitionInputs>
) => {
  const competition = await Competition.findById(competitionId);

  if (!competition) {
    throw new AppError("fail", 404, "Competition not found.", true);
  }

  if (!competition.creator.equals(userId)) {
    throw new AppError(
      "fail",
      403,
      "Forbidden: Only the creator can edit this competition.",
      true
    );
  }

  if (competitionInputs.seniorityLevel) {
    competitionInputs.seniorityLevel = competitionInputs.seniorityLevel.map(
      (level) => level.toLowerCase()
    );
  }

  const updatedCompetition = await Competition.findByIdAndUpdate(
    competition._id,
    { ...competitionInputs },
    { new: true }
  );

  return updatedCompetition;
};
