import { AuthRequest, IToken } from "../types";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  addNewUser,
  checkUserDataExists,
  checkUserExists,
  getUserResetToken,
} from "../services/auth.service";
import bcrypt from "bcrypt";
import crypto from "crypto"

const generateToken = ({ id, role }: IToken): string => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

//  POST /auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      avatarColor,
      clubId,
      nickname,
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        status: "error",
        code: "INCOMPLETE_PAYLOAD",
        message: "firstname, lastname, email and password are compulsory",
      });
    }

    const existingUser = await checkUserExists(email);

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        code: "USER_ALREADY_EXISTS",
        message: "User email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await addNewUser(
      firstName,
      lastName,
      email,
      passwordHash,
      avatarColor,
      nickname,
      clubId,
    );

    if (!newUser) {
      return res.status(404).json({
        status: "error",
        code: "REGISTRATION_ERROR",
        message: "User registration error occured",
      });
    }

    const token = generateToken({
      id: newUser._id.toString(),
      role: newUser.role,
    });

    return res.status(201).json({
      status: "success",
      message:
        "User account created successfully. Please check your email for verification",
      data: {
        id: newUser._id.toString(),
        firstName: firstName,
        lastName: lastName,
        email: newUser.email,
        role: newUser.role,
      },
      token: token,
    });
  } catch (error) {
    console.error(`Error occured during sign up: ${error}`);
    res.status(500).json({
      status: "error",
      code: "SERVER_ERROR",
      message: "Server error",
    });
  }
};

// POST /auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        code: "EMAIL_AND_PASSWORD_REQUIRED",
        message: "input email and password",
      });
    }

    const user = await checkUserDataExists(email);

    if (!user) {
      return res.status(400).json({
        status: "error",
        code: "USER_NOT_EXISTS",
        message: "User email does not exist",
      });
    }

    const passwordCheck = bcrypt.compare(password, user.passwordHash);

    if (!passwordCheck) {
      return res.status(401).json({
        status: "error",
        message: "Password is incorrect",
        code: "INVALID_CREDENTIALS",
      });
    }

    const token = generateToken({ id: user._id.toString(), role: user.role });

    return res.status(200).json({
      status: "success",
      message: "User Login successful",
      token: token,
      data: {
        id: user._id.toString(),
        name: user.firstName + " " + user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(`Error occured during login: ${error}`);
    return res.status(400).json({
      status: "error",
      code: "SERVER_ERROR",
      message: "Server error",
    });
  }
};

// POST /auth/forgot-password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ status: "error", message: "Email is required" });
    }

    const user = await checkUserExists(email);

    if (!user) {
      return res.status(200).json({
        status: "success",
        message:
          "If an account exists with this email, a reset link has been sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiry = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    // await sendPasswordResetEmail(email, resetToken);
    // TODO: sendPasswordResetEmail

    // return res.status(200).json({
    //   status: "success",
    //   message:
    //     "If an account exists with this email, a reset link has been sent",
    // });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};

// PATCH /auth/reset-password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;
    const { password } = req.body;

    if (!token) {
      return res
        .status(400)
        .json({ status: "error", message: "Token is required" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        status: "error",
        code: "PASSWORD_GT_6",
        message: "Password must be at least 6 characters",
      });
    }

    // find user with this token
    const user = await getUserResetToken(token);

    if (!user) {
      return res
        .status(400)
        .json({
          status: "error",
          code: "INVALID_TOKEN",
          message: "Invalid or expired reset link",
        });
    }

    // check token hasn't expired
    if (user.resetPasswordTokenExpiry! < new Date()) {
      return res
        .status(400)
        .json({
          status: "error",
          code: "TOKEN_EXPIRED",
          message: "Reset link has expired",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.passwordHash = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ status: "error", code: "SERVER_ERROR", message: "Server error" });
  }
};
