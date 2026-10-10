import User from "../models/User";

export const checkUserExists = async (email: string) => {
  return await User.findOne({ email });
};

export const checkUserDataExists = async (email: string) => {
  return User.findOne({ email }).select("+password");
};

export const addNewUser = async (
  firstName: string,
  lastName: string,
  email: string,
  passwordHash: string,
  avatarColor: string,
  nickname?: string,
  clubId?: string,
) => {
  return User.create({
    firstName,
    lastName,
    email,
    passwordHash,
    avatarColor,
    nickname,
    clubId,
  });
};

export const getUserByID = async (id: string) => {
  return await User.findById(id);
};


export const getUserResetToken = async (token: string) => { 
  return await User.findOne({
    resetPasswordToken: token,
  }).select("+resetPasswordToken +resetPasswordTokenExpiry +password");
}