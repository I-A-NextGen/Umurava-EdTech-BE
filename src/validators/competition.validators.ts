import Joi from "joi";
import { CompetitionLevels } from "../models/competition.model";

export const postCompetitionSchema = Joi.object({
  title: Joi.string().min(5),
  deadline: Joi.date(),
  duration: Joi.string()
    .pattern(/\d+[dwh]$/)
    .messages({
      "string.pattern.base":
        'Duration must be in the format of a number followed by "d" (days), "h" (hours), or "w" (weeks), e.g., "1d", "2h", "3w".',
    }),
  prize: Joi.string(),
  contactEmail: Joi.string().email(),
  brief: Joi.string(),
  description: Joi.string(),
  requirement: Joi.string(),
  deliverables: Joi.string(),
  skills: Joi.array().items(Joi.string()),
  seniorityLevel: Joi.array().items(
    Joi.string()
      .valid(...Object.values(CompetitionLevels))
      .insensitive()
  ),
  category: Joi.string(),
})
  .options({ presence: "required" })
  .unknown(false);

export const getCompetitionsSchema = Joi.object({
  page: Joi.string().pattern(/\d+$/),
  limit: Joi.string().pattern(/\d+$/),
});

export const putCompetitionSchema = postCompetitionSchema.fork(
  Object.keys(postCompetitionSchema.describe().keys),
  (field) => field.optional()
);
