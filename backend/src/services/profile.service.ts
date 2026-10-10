import { Team } from "../models/Team";
import UserStat from "../models/UserStat";

export const getUserStats = async (id: string) => {
  return UserStat.findOne({ id });
};

export const getAllTeams = async () => { 
  return await Team.find();
}