CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"favoritesIDs" integer[] DEFAULT '{}' NOT NULL,
	"participatedDiscussionsIDs" integer[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
