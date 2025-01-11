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

export const invoicePurposes = t.pgEnum("purpose", [
  "Full Payment",
  "Downpayment",
  "Payment Plan",
  "Interment",
  "Perpetual Care",
  "Reservation",
]);

export const inNeed = t.pgEnum("in_need", ["Yes", "No"]);

export const intermentTypes = t.pgEnum("type", ["Flesh", "Bone"]);

export const users = schema.table("users", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: t.varchar("first_name").notNull(),
  lastName: t.varchar("last_name").notNull(),
  email: t.varchar("email").notNull(),
  password: t.varchar("password").notNull(),
  role: roles().default("ACCOUNTS_CLERK"),
  hasLoggedInOnce: t.boolean("has_logged_in_once").default(false),
  createdBy: t.varchar("created_by"),
  createdAt: t.date("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const properties = schema.table("properties", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.varchar("name").notNull(),
  fullAddress: t.varchar("full_address").notNull(),
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
  taken: t.boolean().default(false),
  createdBy: t.varchar("created_by").notNull(),
  createdAt: t.date("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const clients = schema.table("clients", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: t.varchar("first_name").notNull(),
  lastName: t.varchar("last_name").notNull(),
  birthDate: t.date("birth_date", { mode: "string" }).notNull(),
  email: t.varchar("email").notNull(),
  fullAddress: t.varchar("full_address").notNull(),
  mobileNumber: t.varchar("mobile_number").notNull(),
  landlineNumber: t.varchar("landline_number"),
  createdBy: t.varchar("created_by").notNull(),
  createdAt: t.date("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const clientLots = schema.table("client_lots", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  clientId: t.integer("client_id").notNull(),
  propertyId: t.integer("property_id").notNull(),
  blockId: t.integer("block_id").notNull(),
  lotId: t.integer("lot_id").notNull(),
  reservation: t.integer("reservation"),
  paymentType: t.varchar("payment_type"),
  paymentPlan: t.varchar("payment_plan"),
  inNeed: inNeed("in_need"),
  terms: t.integer("terms"),
  downpayment: t.varchar("downpayment"),
  perpetualCarePrice: t.integer("perpetual_care_price"),
  discount: t.integer("discount"),
  monthsToPay: t.integer("months_to_pay"),
  monthly: t.integer("monthly"),
  totalInterest: t.integer("total_interest"),
  actualPrice: t.integer("actual_price"),
  balance: t.integer("balance"),
  agent: t.varchar("agent"),
  createdBy: t.varchar("created_by"),
  createdAt: t.date("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const interments = schema.table("interments", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  clientLotId: t.integer("client_lot_id").notNull(),
  dig: t.integer("dig"),
  type: intermentTypes(),
  deceasedName: t.varchar("deceased_name"),
  deceasedBorn: t.date("deceased_born", { mode: "string" }),
  deceasedDied: t.date("deceased_died", { mode: "string" }),
  remainsName: t.varchar("remains_name"),
  remainsBorn: t.date("remains_born", { mode: "string" }),
  remainsDied: t.date("remains_died", { mode: "string" }),
  intermentDate: t.date("interment_date", { mode: "string" }),
  intermentTime: t.varchar("interment_time"),
  contractorName: t.varchar("contractor_name"),
  contractorMobileNumber: t.varchar("contractor_mobile_number"),
  lastModifiedBy: t.varchar("created_by"),
  lastModifiedAt: t.date("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const perpetualCares = schema.table("perpetual_cares", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  clientLotId: t.integer("client_lot_id").notNull(),
  installmentYears: t.varchar("installment_years"),
  dueDate: t.date("due_date", { mode: "string" }).notNull(),
  paymentDue: t.integer("payment_due").notNull(),
});

export const invoices = schema.table("invoices", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  clientLotId: t.integer("client_lot_id").notNull(),
  purpose: invoicePurposes().notNull(),
  payment: t.integer().notNull(),
  dateOfPayment: t.date("date_of_payment", { mode: "string" }).notNull(),
  receipt: t.varchar("receipt").notNull(),
  remarks: t.varchar("remarks"),
  createdBy: t.varchar("created_by"),
  createdAt: t.date("created_at", { mode: "date" }).defaultNow().notNull(),
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

export const clientRelations = relations(clients, ({ many }) => ({
  clientLots: many(clientLots),
}));

export const clientLotsRelations = relations(clientLots, ({ one, many }) => ({
  property: one(properties, {
    fields: [clientLots.propertyId],
    references: [properties.id],
  }),
  block: one(blocks, {
    fields: [clientLots.blockId],
    references: [blocks.id],
  }),
  lot: one(lots, {
    fields: [clientLots.lotId],
    references: [lots.id],
  }),
  client: one(clients, {
    fields: [clientLots.clientId],
    references: [clients.id],
  }),
  invoices: many(invoices),
  interments: many(interments),
  perpetualCare: many(perpetualCares),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  clientLot: one(clientLots, {
    fields: [invoices.clientLotId],
    references: [clientLots.id],
  }),
}));

export const intermentsRelations = relations(interments, ({ one }) => ({
  clientLot: one(clientLots, {
    fields: [interments.clientLotId],
    references: [clientLots.id],
  }),
}));

export const perpetualCaresRelations = relations(perpetualCares, ({ one }) => ({
  clientLot: one(clientLots, {
    fields: [perpetualCares.clientLotId],
    references: [clientLots.id],
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

export type Client = InferSelectModel<typeof clients> & {
  clientLots: ClientLot[];
};
export type NewClient = InferInsertModel<typeof clients>;

export type ClientLot = InferSelectModel<typeof clientLots> & {
  property: Property;
  block: Block;
  lot: Lot;
};
export type NewClientLot = InferInsertModel<typeof clientLots>;

export type Invoice = InferSelectModel<typeof invoices>;
export type NewInvoice = InferInsertModel<typeof invoices>;

export type PerpetualCare = InferSelectModel<typeof perpetualCares>;
export type NewPerpetualCare = InferInsertModel<typeof perpetualCares>;

export type Interment = InferSelectModel<typeof interments>;
export type NewInterment = InferInsertModel<typeof interments>;
