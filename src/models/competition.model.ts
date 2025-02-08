import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import { Model, model, Query, Schema, Types } from "mongoose";
import { addDays, addHours, addWeeks, isAfter, isBefore } from "date-fns";

export enum CompetitionType {
  CHALLENGE = "challenge",
  HACKATHON = "Hackathon",
}

export enum CompetitionLevels {
  JUNIOR = "junior",
  INTERMEDIATE = "intermediate",
  SENIOR = "senior",
}

export enum CompetitionStatus {
  OPEN = "open",
  ONGOING = "ongoing",
  COMPLETED = "completed",
}

interface ICompetition extends Document {
  _id: Types.ObjectId;
  thumbnail: string;
  title: string;
  deadline: Date;
  duration: string;
  prize: string;
  contactEmail: string;
  brief: string;
  description: string;
  requirement: string;
  deliverables: string;
  status: CompetitionStatus;
  skills: string[];
  seniorityLevel: string[];
  category: string;
  creator: Types.ObjectId;
  deleted: {
    isDeleted: boolean;
    deletedAt: Date | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

const competitionSchema = new Schema<ICompetition, Model<ICompetition>>(
  {
    // thumbnail: { type: String, required: true },
    title: { type: String, required: true },
    deadline: { type: Date, required: true },
    duration: { type: String, required: true },
    prize: { type: String, required: true },
    contactEmail: { type: String, required: true },
    brief: { type: String, required: true },
    description: { type: String, required: true },
    requirement: { type: String, required: true },
    deliverables: { type: String, required: true },
    skills: { type: [String], required: true },
    seniorityLevel: {
      type: [String],
      enum: {
        values: Object.values(CompetitionLevels),
      },
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deleted: {
      type: new Schema<ICompetition["deleted"]>({
        isDeleted: Boolean,
        deletedAt: Date,
      }),
      default: () => ({ isDeleted: false, deletedAt: null }),
    },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

competitionSchema.pre(/^find/, function (next) {
  (this as Query<any, any>).where({
    $or: [{ "deleted.isDeleted": false }, { "deleted.isDeleted": null }],
  });
  next();
});

competitionSchema.virtual("status").get(function () {
  const unit = this.duration.slice(-1);
  let value = parseInt(this.duration.slice(0, -1), 10);

  let endTime = this.deadline;

  switch (unit) {
    case "d":
      endTime = addDays(this.deadline, value);
      break;
    case "w":
      endTime = addWeeks(this.deadline, value);
      break;
    case "h":
      endTime = addHours(this.deadline, value);
      break;
  }

  if (isAfter(this.deadline, new Date())) return CompetitionStatus.OPEN;

  if (isAfter(endTime, new Date())) return CompetitionStatus.ONGOING;

  return CompetitionStatus.COMPLETED;
});

competitionSchema.plugin(mongooseLeanVirtuals);

const Competition = model<ICompetition>("Competition", competitionSchema);

export default Competition;
