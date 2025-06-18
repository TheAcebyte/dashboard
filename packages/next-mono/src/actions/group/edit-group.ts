"use server";

import { type GroupFields, getGroupSchema } from "@/actions/group/validation";
import { db } from "@/db";
import { findGroupByName } from "@/db/queries/groups";
import { groups } from "@/db/schema/groups";
import type { ServerActionResponse } from "@/types/utils";
import { eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";

export default async function editGroup(
  groupId: string,
  payload: GroupFields,
): Promise<ServerActionResponse> {
  const t = await getTranslations("database-page");
  const groupSchema = getGroupSchema(t);

  const parseResult = groupSchema.safeParse(payload);
  if (!parseResult) {
    return { success: false, message: t("group-action-error-validation") };
  }

  const matchedGroup = await findGroupByName(payload.name);
  if (matchedGroup && matchedGroup.groupId != groupId) {
    return { success: false, message: t("group-action-error-duplicate-name") };
  }

  await db
    .update(groups)
    .set({
      groupId: groupId,
      name: payload.name,
    })
    .where(eq(groups.groupId, groupId));

  return { success: true, message: t("group-action-success-edit") };
}
