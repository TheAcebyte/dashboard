"use server";

import { type GroupFields, groupSchema } from "@/actions/group/validation";
import { db } from "@/db";
import { findGroupByName } from "@/db/queries/groups";
import { groups } from "@/db/schema/groups";
import type { ServerActionResponse } from "@/types/utils";
import { eq } from "drizzle-orm";

export default async function editGroup(
  groupId: string,
  payload: GroupFields,
): Promise<ServerActionResponse> {
  const parseResult = groupSchema.safeParse(payload);
  if (!parseResult) {
    return { success: false, message: "Serverside validation failed." };
  }

  const matchedGroup = await findGroupByName(payload.name);
  if (matchedGroup && matchedGroup.groupId != groupId) {
    return { success: false, message: "Name is already taken." };
  }
  
  await db
    .update(groups)
    .set({
      groupId: groupId,
      name: payload.name,
    })
    .where(eq(groups.groupId, groupId));

  return { success: true, message: "Successfully edited group." };
}
