import { Model, model, Schema, Types, models } from "mongoose";

export interface IParticipant extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  competition: Types.ObjectId;
}

const participantSchema = new Schema<IParticipant, Model<IParticipant>>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    competition: {
      type: Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
    },
  },
  { timestamps: true }
);

const Participant =
  (models.Participant as Model<IParticipant>) ||
  model<IParticipant, Model<IParticipant>>("Participant", participantSchema);

export default Participant;
