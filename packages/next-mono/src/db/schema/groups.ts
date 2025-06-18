import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const groups = sqliteTable("groups", {
  groupId: text("group_id").primaryKey(),
  name: text("name").notNull().unique(),
});

export type GroupRecord = typeof groups.$inferSelect;