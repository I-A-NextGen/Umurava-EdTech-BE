import mongoose from "mongoose";
import Participant from "../../models/participant.model";
import { AppError } from "../../utils/errors.utils";
import Competition from "../../models/competition.model";
import { Request } from "express";
import { UserRoles } from "../../models/user.model";

export const fetchParticipants = async (user: Request["user"], id: string) => {
  try {
    const competition = await Competition.findById(id).lean();

    if (!competition) {
      throw new AppError("fail", 404, "Competition not found.", true);
    }

    if (!competition.creator.equals(user.id) && user.role !== UserRoles.ADMIN) {
      throw new AppError(
        "fail",
        401,
        "Access denied: Only the competition creator can view participants.",
        true
      );
    }

    const participants = await Participant.find({
      competition: competition._id,
    })
      .select("user")
      .populate({
        path: "user",
        select: "profile email",
        populate: {
          path: "profile",
          select: "firstName lastName fullName title photo -user",
        },
      })
      .lean({ virtuals: true });

    const formattedParticipants = participants.map(
      (participant) => participant.user
    );

    return formattedParticipants;
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
