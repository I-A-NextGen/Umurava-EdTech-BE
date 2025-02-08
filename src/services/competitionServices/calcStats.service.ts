import { Request } from "express";
import Competition from "../../models/competition.model";
import { isSameMonth, isSameWeek, isSameYear } from "date-fns";
import Participant from "../../models/participant.model";

export const calcStats = async (user: Request["user"]) => {
  const competitions = await Competition.find({}).lean({ virtuals: true });
  const participants = await Participant.find({}).lean();

  const stats = {
    all: {
      competitions: competitions.length,
      participants: participants.length,
      completed: 0,
      open: 0,
      ongoing: 0,
    },
    week: {
      competitions: 0,
      participants: 0,
      completed: 0,
      open: 0,
      ongoing: 0,
    },
    month: {
      competitions: 0,
      participants: 0,
      completed: 0,
      open: 0,
      ongoing: 0,
    },
    year: {
      competitions: 0,
      participants: 0,
      completed: 0,
      open: 0,
      ongoing: 0,
    },
  };

  competitions.forEach((competition) => {
    stats.all[competition.status] = stats.all[competition.status] + 1;

    if (isSameWeek(new Date(), competition.createdAt, { weekStartsOn: 1 })) {
      stats.week.competitions = stats.week.competitions + 1;
      stats.week[competition.status] = stats.week[competition.status] + 1;
    }

    if (isSameMonth(new Date(), competition.createdAt)) {
      stats.month.competitions = stats.month.competitions + 1;
      stats.month[competition.status] = stats.month[competition.status] + 1;
    }

    if (isSameYear(new Date(), competition.createdAt)) {
      stats.year.competitions = stats.year.competitions + 1;
      stats.year[competition.status] = stats.year[competition.status] + 1;
    }
  });

  participants.forEach((participant) => {
    if (isSameWeek(new Date(), participant.createdAt, { weekStartsOn: 1 })) {
      stats.week.participants = stats.week.participants + 1;
    }

    if (isSameMonth(new Date(), participant.createdAt)) {
      stats.month.participants = stats.month.participants + 1;
    }

    if (isSameYear(new Date(), participant.createdAt)) {
      stats.year.participants = stats.year.participants + 1;
    }
  });

  return stats;
};
