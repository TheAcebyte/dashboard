import { db } from "@/db";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const studentsTable = sqliteTable("student", {
  studentId: text("student_id").primaryKey().$defaultFn(randomUUID),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  cne: text("cne").notNull().unique(),
  birthDate: integer("birth_date", { mode: "timestamp" }).notNull(),
  picture: blob("picture_src", { mode: "buffer" }).notNull(),
});

export function findStudentByCNE(cne: string) {
  return db.select().from(studentsTable).where(eq(studentsTable.cne, cne));
}

export function findStudentById(id: string) {
  return db.select().from(studentsTable).where(eq(studentsTable.studentId, id));
}
