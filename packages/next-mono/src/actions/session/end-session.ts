"use server";

import { db } from "@/db";
import { findSessionById } from "@/db/queries/sessions";
import { sessions } from "@/db/schema/sessions";
import { eq } from "drizzle-orm";

export default async function endSession(sessionId: string) {
  const matchedSession = await findSessionById(sessionId);
  if (!matchedSession) {
    return {
      success: false,
      message: "Could not find session.",
    };
  }

  const finishedAt = Date.now();
  await db
    .update(sessions)
    .set({ status: "ended", finishedAt: finishedAt })
    .where(eq(sessions.sessionId, sessionId));

  return {
    success: true,
    message: "Successfully ended session.",
  };
}
