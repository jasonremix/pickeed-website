CREATE TYPE "public"."account_status" AS ENUM('active', 'paused', 'suspended', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."admin_role" AS ENUM('super_admin', 'moderator', 'support', 'analyst');--> statement-breakpoint
CREATE TYPE "public"."auth_code_purpose" AS ENUM('sign_in', 'email_change');--> statement-breakpoint
CREATE TYPE "public"."consent_type" AS ENUM('terms', 'privacy', 'push', 'calendar', 'sensitive_data');--> statement-breakpoint
CREATE TYPE "public"."follow_status" AS ENUM('pending', 'accepted');--> statement-breakpoint
CREATE TYPE "public"."page_role" AS ENUM('owner', 'admin', 'editor', 'analyst');--> statement-breakpoint
CREATE TYPE "public"."page_type" AS ENUM('creator', 'business', 'brand', 'club', 'provider');--> statement-breakpoint
CREATE TABLE "admin_users" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"role" "admin_role" NOT NULL,
	"mfa_enrolled_at" timestamp with time zone,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"actor_user_id" uuid,
	"action" text NOT NULL,
	"target_type" text,
	"target_id" uuid,
	"reason" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"ip_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "audit_log_action_format" CHECK ("audit_log"."action" ~ '^[a-z][a-z0-9_.]*$')
);
--> statement-breakpoint
CREATE TABLE "auth_codes" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"email" "citext" NOT NULL,
	"code_hash" text NOT NULL,
	"purpose" "auth_code_purpose" DEFAULT 'sign_in' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "auth_codes_attempts_range" CHECK ("auth_codes"."attempts" between 0 and 10),
	CONSTRAINT "auth_codes_expiry_after_creation" CHECK ("auth_codes"."expires_at" > "auth_codes"."created_at")
);
--> statement-breakpoint
CREATE TABLE "consents" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "consent_type" NOT NULL,
	"version" text NOT NULL,
	"granted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"bio" text,
	"birthdate" date NOT NULL,
	"locale" text DEFAULT 'de-CH' NOT NULL,
	"time_zone" text DEFAULT 'Europe/Zurich' NOT NULL,
	"is_private" boolean DEFAULT true NOT NULL,
	"searchable" boolean DEFAULT true NOT NULL,
	"indexable" boolean DEFAULT false NOT NULL,
	"age_verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_display_name_length" CHECK (char_length(btrim("profiles"."display_name")) between 1 and 80),
	CONSTRAINT "profiles_bio_length" CHECK ("profiles"."bio" is null or char_length("profiles"."bio") <= 500),
	CONSTRAINT "profiles_locale" CHECK ("profiles"."locale" in ('de-CH', 'fr-CH', 'it-CH', 'en-CH'))
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"user_agent" text,
	"ip_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	CONSTRAINT "sessions_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"email" "citext" NOT NULL,
	"email_verified_at" timestamp with time zone,
	"status" "account_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_email_format" CHECK ("users"."email"::text ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
	CONSTRAINT "users_email_length" CHECK (char_length("users"."email"::text) <= 254)
);
--> statement-breakpoint
CREATE TABLE "blocks" (
	"blocker_id" uuid NOT NULL,
	"blocked_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blocks_blocker_id_blocked_id_pk" PRIMARY KEY("blocker_id","blocked_id"),
	CONSTRAINT "blocks_not_self" CHECK ("blocks"."blocker_id" <> "blocks"."blocked_id")
);
--> statement-breakpoint
CREATE TABLE "follows" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"follower_id" uuid NOT NULL,
	"target_user_id" uuid,
	"target_page_id" uuid,
	"status" "follow_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"accepted_at" timestamp with time zone,
	CONSTRAINT "follows_exactly_one_target" CHECK (num_nonnulls("follows"."target_user_id", "follows"."target_page_id") = 1),
	CONSTRAINT "follows_not_self" CHECK ("follows"."target_user_id" is null or "follows"."target_user_id" <> "follows"."follower_id")
);
--> statement-breakpoint
CREATE TABLE "handles" (
	"handle" "citext" PRIMARY KEY NOT NULL,
	"profile_id" uuid,
	"page_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "handles_profile_id_unique" UNIQUE("profile_id"),
	CONSTRAINT "handles_page_id_unique" UNIQUE("page_id"),
	CONSTRAINT "handles_exactly_one_owner" CHECK (num_nonnulls("handles"."profile_id", "handles"."page_id") = 1),
	CONSTRAINT "handles_lowercase" CHECK ("handles"."handle"::text = lower("handles"."handle"::text)),
	CONSTRAINT "handles_format" CHECK ("handles"."handle"::text ~ '^[a-z0-9]([a-z0-9._]{1,28})[a-z0-9]$'),
	CONSTRAINT "handles_no_double_dot" CHECK (position('..' in "handles"."handle"::text) = 0)
);
--> statement-breakpoint
CREATE TABLE "page_members" (
	"page_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "page_role" NOT NULL,
	"invited_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "page_members_page_id_user_id_pk" PRIMARY KEY("page_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"type" "page_type" NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"location" text,
	"website" text,
	"status" "account_status" DEFAULT 'active' NOT NULL,
	"verified_at" timestamp with time zone,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "pages_name_length" CHECK (char_length(btrim("pages"."name")) between 1 and 80),
	CONSTRAINT "pages_description_length" CHECK ("pages"."description" is null or char_length("pages"."description") <= 1000),
	CONSTRAINT "pages_website_https" CHECK ("pages"."website" is null or "pages"."website" ~ '^https://')
);
--> statement-breakpoint
ALTER TABLE "admin_users" ADD CONSTRAINT "admin_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consents" ADD CONSTRAINT "consents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_blocker_id_users_id_fk" FOREIGN KEY ("blocker_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_blocked_id_users_id_fk" FOREIGN KEY ("blocked_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_target_user_id_users_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_target_page_id_pages_id_fk" FOREIGN KEY ("target_page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handles" ADD CONSTRAINT "handles_profile_id_profiles_user_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handles" ADD CONSTRAINT "handles_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_members" ADD CONSTRAINT "page_members_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_members" ADD CONSTRAINT "page_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_members" ADD CONSTRAINT "page_members_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_log_created_idx" ON "audit_log" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "audit_log_target_idx" ON "audit_log" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE INDEX "auth_codes_email_created_idx" ON "auth_codes" USING btree ("email","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "consents_user_idx" ON "consents" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "consents_one_active_per_type" ON "consents" USING btree ("user_id","type") WHERE "consents"."revoked_at" is null;--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "blocks_blocked_idx" ON "blocks" USING btree ("blocked_id");--> statement-breakpoint
CREATE UNIQUE INDEX "follows_user_unique" ON "follows" USING btree ("follower_id","target_user_id") WHERE "follows"."target_user_id" is not null;--> statement-breakpoint
CREATE UNIQUE INDEX "follows_page_unique" ON "follows" USING btree ("follower_id","target_page_id") WHERE "follows"."target_page_id" is not null;--> statement-breakpoint
CREATE INDEX "follows_target_user_idx" ON "follows" USING btree ("target_user_id","status");--> statement-breakpoint
CREATE INDEX "follows_target_page_idx" ON "follows" USING btree ("target_page_id","status");--> statement-breakpoint
CREATE INDEX "follows_follower_idx" ON "follows" USING btree ("follower_id","status");--> statement-breakpoint
CREATE INDEX "page_members_user_idx" ON "page_members" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "page_members_one_owner" ON "page_members" USING btree ("page_id") WHERE "page_members"."role" = 'owner';