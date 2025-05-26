"use server";

import { db } from "@/db";
import { findGroupById } from "@/db/queries/groups";
import { groups } from "@/db/schema/groups";
import type { ServerActionResponse } from "@/types/utils";
import { eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";

export default async function deleteGroup(
  groupId: string,
): Promise<ServerActionResponse> {
  const t = await getTranslations("database-page");
  const matchedGroup = await findGroupById(groupId);
  if (!matchedGroup) {
    return { success: false, message: t("group-action-error-not-found") };
  }

  await db.delete(groups).where(eq(groups.groupId, groupId));
  return { success: true, message: t("student-action-success-delete") };
}
