import Participant from "../../models/participant.model";
import { AppError } from "../../utils/errors.utils";

export const saveCompetitionApplication = async (
  user: string,
  competition: string
) => {
  const existingApplication = await Participant.findOne({ user, competition });

  if (existingApplication) {
    throw new AppError(
      "fail",
      409,
      "You have already applied to this competition.",
      true
    );
  }

  await Participant.create({ user, competition });

  return;
};
