"use server";

import { db } from "@/db";
import { findGroupById } from "@/db/queries/groups";
import { groups } from "@/db/schema/groups";
import type { ServerActionResponse } from "@/types/utils";
import { eq } from "drizzle-orm";

export default async function deleteGroup(
  groupId: string,
): Promise<ServerActionResponse> {
  const matchedGroup = await findGroupById(groupId);
  if (!matchedGroup) {
    return { success: false, message: "Could not find group." };
  }
  
  await db.delete(groups).where(eq(groups.groupId, groupId));
  return { success: true, message: "Successfully deleted group." };
}
