"use server";

import { db } from "@/db";
import { findSessionById } from "@/db/queries/sessions";
import { sessions } from "@/db/schema/sessions";
import { eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";

export default async function endSession(
  sessionId: string,
  manual: boolean = false,
) {
  const t = await getTranslations("attendance-page");
  const matchedSession = await findSessionById(sessionId);
  if (!matchedSession) {
    return {
      success: false,
      message: t("session-action-error-not-found"),
    };
  }

  const { startedAt, plannedDuration } = matchedSession;
  const finishedAt =
    !manual && plannedDuration ? startedAt + plannedDuration : Date.now();
  await db
    .update(sessions)
    .set({ status: "ended", finishedAt: finishedAt })
    .where(eq(sessions.sessionId, sessionId));

  return {
    success: true,
    message: t("session-action-success-end"),
  };
}
