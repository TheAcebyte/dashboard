import { cst } from "@/constants";
import { groups } from "@/db/schema/groups";
import * as studentSchema from "@/db/schema/students";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const client = createClient({ url: cst.DATABASE_URL });

export const db = drizzle(client, {
  schema: { ...studentSchema, groups },
});
