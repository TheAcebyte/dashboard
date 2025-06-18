import { groups } from "@/db/schema/groups";
import { students } from "@/db/schema/students";
import { sql } from "drizzle-orm";
import { check, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const sessions = sqliteTable(
  "sessions",
  {
    sessionId: text("session_id").primaryKey(),
    groupId: text("group_id")
      .notNull()
      .references(() => groups.groupId, { onDelete: "cascade" }),
    status: text("status").notNull(),
    name: text("name").notNull(),
    startedAt: integer("started_at").notNull(),
    finishedAt: integer("finished_at"),
    plannedDuration: integer("planned_duration"),
    lateThreshold: integer("late_threshold"),
  },
  (table) => [
    check(
      "status_check",
      sql`${table.status} = 'active' OR ${table.status} = 'ended'`,
    ),
  ],
);

export const sessionStudents = sqliteTable(
  "session_students",
  {
    sessionId: text("session_id").references(() => sessions.sessionId, {
      onDelete: "cascade",
    }),
    studentId: text("student_id").references(() => students.studentId, {
      onDelete: "cascade",
    }),
    studentStatus: text("student_status").notNull(),
    studentExcuse: text("student_excuse"),
    arrivedAt: integer("arrived_at"),
  },
  (table) => [
    check(
      "student_status_check",
      sql`${table.studentStatus} = 'present' OR ${table.studentStatus} = 'absent' OR ${table.studentStatus} = 'late' OR ${table.studentStatus} = 'excused'`,
    ),
  ],
);
