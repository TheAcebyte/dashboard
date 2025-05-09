"use server";

import { type GroupFields, groupSchema } from "@/actions/group/validation";
import { db } from "@/db";
import { findGroupByName } from "@/db/queries/groups";
import { groups } from "@/db/schema/groups";
import type { ServerActionResponse } from "@/types/utils";
import { randomUUID } from "crypto";

export default async function addGroup(
  payload: GroupFields,
): Promise<ServerActionResponse> {
  const parseResult = groupSchema.safeParse(payload);
  if (!parseResult) {
    return { success: false, message: "Serverside validation failed." };
  }

  const matchedGroup = await findGroupByName(payload.name);
  if (matchedGroup) {
    return { success: false, message: "Name is already taken." };
  }

  const groupId = randomUUID();
  await db.insert(groups).values({
    groupId: groupId,
    name: payload.name,
  });

  return { success: true, message: "Successfully added group." };
}
