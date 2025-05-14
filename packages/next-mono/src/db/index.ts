import { cst } from "@/constants";
import * as groupSchema from "@/db/schema/groups";
import * as sessionSchema from "@/db/schema/sessions";
import * as studentSchema from "@/db/schema/students";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const client = createClient({ url: cst.DATABASE_URL });

export const db = drizzle(client, {
  schema: { ...studentSchema, ...groupSchema, ...sessionSchema },
});
