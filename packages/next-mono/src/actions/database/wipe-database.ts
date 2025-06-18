"use server";

import { db } from "@/db";
import { groups } from "@/db/schema/groups";
import { students } from "@/db/schema/students";
import type { ServerActionResponse } from "@/types/utils";
import { getTranslations } from "next-intl/server";

export default async function wipeDatabase(): Promise<ServerActionResponse> {
  const t = await getTranslations("settings-page");
  await db.delete(students);
  await db.delete(groups);
  return { success: true, message: t("action-wipe-database-success") };
}
