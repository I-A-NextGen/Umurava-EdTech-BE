import { Model, model, Schema, Types, models } from "mongoose";

interface IParticipant {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  challengeId: Types.ObjectId;
}

const participantSchema = new Schema<IParticipant, Model<IParticipant>>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    challengeId: { type: Schema.Types.ObjectId, ref: "ChallengeHackathon", required: true },
  },
  { timestamps: true }
);

const Participant = models.Participant || model<IParticipant>("Participant", participantSchema);

export default Participant;
