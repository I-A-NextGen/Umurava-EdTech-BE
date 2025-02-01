import Competition from "../../models/competition.model";

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

  const competition = await Competition.create({
    ...competitionInputs,
    seniorityLevel: competitionInputs.seniorityLevel.map((level) =>
      level.toLowerCase()
    ),
  });
  return competition;
};

export default createNewCompetition;
