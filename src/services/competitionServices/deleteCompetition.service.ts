import mongoose from "mongoose";
import Competition from "../../models/competition.model";
import { ICompetitionInputs } from "./createCompetition.service";
import { AppError } from "../../utils/errors.utils";

export const softDeleteCompetition = async (
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

  await Competition.findByIdAndUpdate(
    competition._id,
    { "deleted.isDeleted": true, "deleted.deletedAt": new Date() },
    { new: true }
  );

  return true;
};
