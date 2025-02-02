import Competition from "../../models/competition.model";
import { AppError } from "../../utils/errors.utils";

export interface ICompetitionInputs {
  title: string;
  deadline: Date;
  duration: string;
  prize: string;
  contactEmail: string;
  brief: string;
  description: string;
  requirement: string;
  deliverables: string;
  status: string;
  skills: string[];
  seniorityLevel: string[];
  category: string;
  creator: string;
}

const createNewCompetition = async (competitionInputs: ICompetitionInputs) => {
  const existingCompetition = await Competition.findOne({
    title: { $regex: new RegExp(competitionInputs.title, "i") },
    creator: competitionInputs.creator,
  });

  if (existingCompetition) {
    throw new AppError(
      "fail",
      409,
      "You already have a competition with the same title.",
      true
    );
  }

  const competition = await Competition.create({
    ...competitionInputs,
    seniorityLevel: competitionInputs.seniorityLevel.map((level) =>
      level.toLowerCase()
    ),
  });
  return competition;
};

export default createNewCompetition;
