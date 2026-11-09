import { Club, IClub } from "../models/Club";
import { findBook } from "../services/book.service";
import {
  findClub,
  ISettings,
  newClub,
  updateClub,
} from "../services/club.service";
import { AuthRequest } from "../types";
import { Response } from "express";
import { Types } from "mongoose";

// POST /club
export const addNewClub = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      joinCode,
      joinCodeExpiresAt,
      timezone,
      minReflectionWords,
      pauseWeeksPerTerm,
      consent,
    } = req.body;

    if (!name || !joinCode) {
      return res.status(400).json({
        status: "error",
        code: "INCOMPLETE_PAYLOAD",
        message: "name and joincode are required",
      });
    }

    const settings = {
      timezone: timezone ?? "Africa/Lagos",
      minReflectionWords: minReflectionWords ?? 10,
      pauseWeeksPerTerm: pauseWeeksPerTerm ?? 1,
      requireGuardianConsentUnder18: consent ?? false,
    };

    const club = await newClub(name, settings, joinCode, joinCodeExpiresAt);

    if (!club) {
      return res.status(400).json({
        status: "error",
        code: "ADD_CLUB_ERROR",
        message: "Failed to add new club",
      });
    }

    return res.status(201).json({
      status: "success",
      message: "Successfully added a new club",
      data: club,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      code: "SERVER_ERROR",
      message: `An error occured: ${error}`,
    });
  }
};

// TODO fix the editClub code
// PATCH /clubs
export const editClub = async (req: AuthRequest, res: Response) => {
  try {
    const clubId = req.user?.clubId;

    if (!clubId) {
      return res.status(401).json({
        status: "error",
        code: "UNAUTHORIZED",
        message: "You must be authenticated to edit a club",
      });
    }

    const {
      name,
      joinCode,
      joinCodeExpiresAt,
      timezone,
      minReflectionWords,
      pauseWeeksPerTerm,
      consent,
    } = req.body;

    const updates: Record<string, unknown> = {};

    // Main club fields
    if (name !== undefined) {
      updates.name = name;
    }

    if (joinCode !== undefined) {
      updates.joinCode = joinCode;
    }

    if (joinCodeExpiresAt !== undefined) {
      updates.joinCodeExpiresAt = joinCodeExpiresAt;
    }

    // Nested settings: use dotted paths
    if (timezone !== undefined) {
      updates["settings.timezone"] = timezone;
    }

    if (minReflectionWords !== undefined) {
      updates["settings.minReflectionWords"] = minReflectionWords;
    }

    if (pauseWeeksPerTerm !== undefined) {
      updates["settings.pauseWeeksPerTerm"] = pauseWeeksPerTerm;
    }

    if (consent !== undefined) {
      updates["settings.requireGuardianConsentUnder18"] = consent;
    }

    // Reject an empty update
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: "error",
        code: "EMPTY_UPDATE",
        message: "Provide at least one field to update",
      });
    }

    const updatedClub = await updateClub("GELM", updates);

    console.log("UPdated club: ", updatedClub);

    if (!updatedClub) {
      return res.status(404).json({
        status: "error",
        code: "CLUB_NOT_FOUND",
        message: "Club not found or could not be updated",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Successfully updated the club",
      data: updatedClub,
    });
  } catch (error) {
    console.error("Error updating club:", error);

    return res.status(500).json({
      status: "error",
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred while updating the club",
    });
  }
};

// PATCH /club/current-book
export const setCurrentBook = async (req: AuthRequest, res: Response) => {
  try {
    const bookId = req.body.bookId as Types.ObjectId;
    const clubId = req.user?.clubId;

    if (!clubId) {
      return res.status(400).json({
        status: "error",
        code: "CLUB_ID_ERROR",
        message: "Club ID is required",
      });
    }

    const book = await findBook(bookId, clubId);

    if (!book) {
      return res.status(404).json({
        status: "error",
        message: "Book not found in this club",
      });
    }

    const club = await findClub(clubId);

    if (!club) {
      return res.status(404).json({
        status: "error",
        code: "CLUB_NOT_FOUND",
        message: "Club not found",
      });
    }

    club.settings.currentBookId = bookId;
    await club.save();

    return res.status(200).json({
      status: "success",
      message: "Current book updated successfully",
      data: {
        currentBookId: bookId,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      code: "SERVER_ERROR",
      message: `An error occured: ${error}`,
    });
  }
};
