import { pgTable, integer, varchar, json, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const wireframeToCode = pgTable("wireframeToCode", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: ""wireframeToCode_id_seq"", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	uid: varchar(),
	imageUrl: varchar(),
	model: varchar(),
	description: varchar(),
	code: json(),
	createdBy: varchar(),
});

export const users = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "users_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	credits: integer().default(0),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);
