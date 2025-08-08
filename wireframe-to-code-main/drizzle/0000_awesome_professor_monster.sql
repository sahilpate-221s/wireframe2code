-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "wireframeToCode" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name ""wireframeToCode_id_seq"" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1),
	"uid" varchar,
	"imageUrl" varchar,
	"model" varchar,
	"description" varchar,
	"code" json,
	"createdBy" varchar
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"credits" integer DEFAULT 0,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

*/