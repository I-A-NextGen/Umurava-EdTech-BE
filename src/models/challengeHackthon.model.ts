import { Model, model, Schema, Types, models } from "mongoose";

interface IChallengeHackathon {
  _id: Types.ObjectId;
  title: string;
  deadline: Date;
  duration: string;
  moneyPrize: string;
  contactEmail: string;
  projectDescription: string;
  projectBrief: string;
  status: string;
  skills: string[];
  seniorityLevel: string[];
  category: string;
  postedBy: Types.ObjectId;
}

const challengeHackathonSchema = new Schema<IChallengeHackathon, Model<IChallengeHackathon>>(
  {
    title: { type: String, required: true },
    deadline: { type: Date, required: true },
    duration: { type: String, required: true },
    moneyPrize: { type: String, required: true },
    contactEmail: { type: String, required: true },
    projectDescription: { type: String, required: true },
    projectBrief: { type: String, required: true },
    status: { type: String, required: true },
    skills: { type: [String], required: true },
    seniorityLevel: { type: [String], required: true },
    category: { type: String, required: true },
    postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const ChallengeHackathon =
  models.ChallengeHackathon || model<IChallengeHackathon>("ChallengeHackathon", challengeHackathonSchema);

export default ChallengeHackathon;
