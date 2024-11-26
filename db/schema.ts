import { relations } from "drizzle-orm";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import "dotenv/config";

const schemaName: string = process.env.SCHEMA || "";

export const schema = t.pgSchema(schemaName);

export const roles = t.pgEnum("role", ["ADMIN", "ACCOUNTS_CLERK"]);

export const users = schema.table("users", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: t.varchar("first_name").notNull(),
  lastName: t.varchar("last_name").notNull(),
  email: t.varchar("email").notNull(),
  password: t.varchar("password").notNull(),
  role: roles().default("ACCOUNTS_CLERK"),
  hasLoggedInOnce: t.boolean("has_logged_in_once").default(false),
  createdBy: t.varchar("created_by"),
  createdAt: t.date("created_at", { mode: "date" }).defaultNow(),
});

export const properties = schema.table("properties", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.varchar("name").notNull(),
  fullAddress: t.varchar("full_address").notNull(),
  noOfBlocks: t.integer("number_of_blocks").default(0),
  noOfLots: t.integer("number_of_lots").default(0),
  takenLots: t.integer("taken_lots").default(0),
  availableLots: t.integer("available_lots").default(0),
  createdBy: t.varchar("created_by"),
  createdAt: t.date("created_at", { mode: "date" }).defaultNow(),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Property = InferSelectModel<typeof properties>;
export type NewProperty = InferInsertModel<typeof properties>;
