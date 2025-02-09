import Profile from "../../models/profile.model";

export const getProfileByUserId = async (userId: string) => {
  return await Profile.findOne({ user: userId }).lean({ virtuals: true });
};