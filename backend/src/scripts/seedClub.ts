// src/scripts/seedClub.ts
//
// Run with: npx ts-node src/scripts/seedClub.ts
// (or: npm run seed:club, if you add the script below to package.json)
//
// Creates one Club document for local testing. Safe to run more than once —
// it checks for an existing club with the same joinCode first, instead of
// creating duplicates every time you run it.

import mongoose from "mongoose";
import { env } from "../config/env";
import { Club } from "../models/Club";

async function seedClub() {
  await mongoose.connect(env.MONGODB_URI);
  console.log("MongoDB connected");

  const existing = await Club.findOne({ joinCode: "TYG" });

  if (existing) {
    console.log("Club already exists:", existing._id.toString());
    await mongoose.disconnect();
    return;
  }

  const club = await Club.create({
    name: "The Youth of Glory",
    joinCode: "TYG",
    settings: {
      timezone: "Africa/Lagos",
      minWords: 10,
      pauseWeeksPerTerm: 1,
      requireGuardianConsentUnder18: true,
      // currentBookId is left unset here — set it after you seed a Book,
      // since the club needs to exist first before anything can reference it.
    },
    pointsConfig: {
      checkin: 1,
      readingComplete: 2,
      reflection: 10,
      quiz: 5,
      discussion: 2,
    },
  });

  console.log("Club created:");
  console.log({
    id: club._id.toString(),
    name: club.name,
    joinCode: club.joinCode,
  });

  await mongoose.disconnect();
  console.log("Done.");
}

seedClub().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
