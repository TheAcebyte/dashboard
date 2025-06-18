import { groups } from "@/db/schema/groups";
import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const students = sqliteTable("students", {
  studentId: text("student_id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  cne: text("cne").notNull().unique(),
  birthDate: integer("birth_date").notNull(),
  groupId: text("group_id")
    .notNull()
    .references(() => groups.groupId),
  pictureUrl: text("picture_url").notNull(),
});

export const studentPictures = sqliteTable("student_pictures", {
  studentId: text("student_id")
    .primaryKey()
    .references(() => students.studentId, { onDelete: "cascade" }),
  picture: blob("picture", { mode: "buffer" }).notNull(),
});
