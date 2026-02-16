CREATE SCHEMA "public";
CREATE SCHEMA "_system";
CREATE TABLE "email_drafts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"email_type" varchar,
	"style" varchar NOT NULL,
	"content" text NOT NULL,
	"form_data" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
CREATE TABLE "email_history" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" varchar,
	"email_content" text NOT NULL,
	"style" varchar NOT NULL,
	"email_type" varchar,
	"subject" varchar,
	"form_data" jsonb,
	"word_count" varchar,
	"created_at" timestamp DEFAULT now()
);
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" varchar CONSTRAINT "users_email_unique" UNIQUE,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"is_admin" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
CREATE TABLE "_system"."replit_database_migrations_v1" (
	"id" bigserial PRIMARY KEY,
	"build_id" text NOT NULL,
	"deployment_id" text NOT NULL,
	"statement_count" bigint NOT NULL,
	"applied_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE "email_drafts" ADD CONSTRAINT "email_drafts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "email_history" ADD CONSTRAINT "email_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
CREATE UNIQUE INDEX "email_drafts_pkey" ON "email_drafts" ("id");
CREATE UNIQUE INDEX "email_history_pkey" ON "email_history" ("id");
CREATE INDEX "IDX_session_expire" ON "sessions" ("expire");
CREATE UNIQUE INDEX "sessions_pkey" ON "sessions" ("sid");
CREATE UNIQUE INDEX "users_email_unique" ON "users" ("email");
CREATE UNIQUE INDEX "users_pkey" ON "users" ("id");
CREATE UNIQUE INDEX "idx_replit_database_migrations_v1_build_id" ON "_system"."replit_database_migrations_v1" ("build_id");
CREATE UNIQUE INDEX "replit_database_migrations_v1_pkey" ON "_system"."replit_database_migrations_v1" ("id");