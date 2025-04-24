import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const students = sqliteTable("students", {
  studentId: text("student_id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  cne: text("cne").notNull().unique(),
  birthDate: integer("birth_date").notNull(),
  group: text("group").notNull(),
  pictureUrl: text("picture_url").notNull(),
});

export const studentPictures = sqliteTable("student_pictures", {
  studentId: text("student_id")
    .primaryKey()
    .references(() => students.studentId),
  picture: blob("picture", { mode: "buffer" }).notNull(),
});

export type StudentColumns = typeof students.$inferSelect;
