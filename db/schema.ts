import { relations } from "drizzle-orm";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import "dotenv/config";

const schemaName: string = process.env.SCHEMA || "";

export const schema = t.pgSchema(schemaName);

export const roles = t.pgEnum("role", ["ADMIN", "ACCOUNTS_CLERK"]);

export const lotTypes = t.pgEnum("lot_type", [
  "Corner",
  "Family Estate",
  "Inner",
  "Pathway",
  "Roadside",
]);

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
  createdBy: t.varchar("created_by").notNull(),
  createdAt: t.date("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const blocks = schema.table("blocks", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  propertyId: t.integer("property_id"),
  name: t.varchar("name").notNull(),
  createdBy: t.varchar("created_by").notNull(),
  createdAt: t.date("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const lots = schema.table("lots", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  blockId: t.integer("block_id"),
  name: t.varchar("name").notNull(),
  lotType: lotTypes().notNull(),
  price: t.decimal().notNull(),
  remarks: t.varchar(),
  createdBy: t.varchar("created_by").notNull(),
  createdAt: t.date("created_at", { mode: "date" }).defaultNow(),
});

export const clients = schema.table("clients", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: t.varchar("first_name").notNull(),
  lastName: t.varchar("last_name").notNull(),
  birthDate: t.date("birth_date", { mode: "string" }).notNull(),
  email: t.varchar("email").notNull(),
  fullAddress: t.varchar("full_address").notNull(),
  mobileNumber: t.varchar("mobile_number").notNull(),
  landlineNumber: t.varchar("landline_number").notNull(),
  createdBy: t.varchar("created_by").notNull(),
  createdAt: t.date("created_at", { mode: "date" }).defaultNow(),
});

export const propertyRelations = relations(properties, ({ many }) => ({
  blocks: many(blocks),
}));

export const blockRelations = relations(blocks, ({ one, many }) => ({
  property: one(properties, {
    fields: [blocks.propertyId],
    references: [properties.id],
  }),
  lots: many(lots),
}));

export const lotRelations = relations(lots, ({ one, many }) => ({
  block: one(blocks, {
    fields: [lots.blockId],
    references: [blocks.id],
  }),
}));

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Property = InferSelectModel<typeof properties> & {
  blocks: Block[] & {
    lots: Lot[];
  };
};
export type NewProperty = InferInsertModel<typeof properties>;

export type Block = InferSelectModel<typeof blocks>;
export type NewBlock = InferInsertModel<typeof blocks>;

export type Lot = InferSelectModel<typeof lots>;
export type NewLot = InferInsertModel<typeof lots>;

export type Client = InferSelectModel<typeof clients>;
export type NewClient = InferInsertModel<typeof clients>;
