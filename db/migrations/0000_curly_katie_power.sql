CREATE TYPE "quizzle"."quizzle__question_type" AS ENUM('multi_choice', 'single_choice', 'text');--> statement-breakpoint
CREATE TYPE "quizzle"."quizzle__quiz_difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "quizzle"."quizzle__user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "quizzle"."quizzle__accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizzle"."quizzle__sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "quizzle__sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "quizzle"."quizzle__verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizzle"."quizzle__question_options" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"value" text NOT NULL,
	"is_correct" boolean DEFAULT false NOT NULL,
	"question_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizzle"."quizzle__questions" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"time_limit_seconds" integer,
	"total_points" integer DEFAULT 100 NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"difficulty" "quizzle"."quizzle__quiz_difficulty" DEFAULT 'easy' NOT NULL,
	"creator_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "quizzle"."quizzle__text_question_settings" (
	"question_id" text PRIMARY KEY NOT NULL,
	"acceptable_answers" text[] NOT NULL,
	"ignore_case" boolean DEFAULT true,
	"trim_whitespace" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "quizzle"."quizzle__users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" timestamp with time zone,
	"display_name" text NOT NULL,
	"password_hash" text,
	"role" "quizzle"."quizzle__user_role" DEFAULT 'user' NOT NULL,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "quizzle__users_username_unique" UNIQUE("username"),
	CONSTRAINT "quizzle__users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "quizzle"."quizzle__accounts" ADD CONSTRAINT "quizzle__accounts_user_id_quizzle__users_id_fk" FOREIGN KEY ("user_id") REFERENCES "quizzle"."quizzle__users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzle"."quizzle__sessions" ADD CONSTRAINT "quizzle__sessions_user_id_quizzle__users_id_fk" FOREIGN KEY ("user_id") REFERENCES "quizzle"."quizzle__users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzle"."quizzle__question_options" ADD CONSTRAINT "quizzle__question_options_question_id_quizzle__questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "quizzle"."quizzle__questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzle"."quizzle__questions" ADD CONSTRAINT "quizzle__questions_creator_id_quizzle__users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "quizzle"."quizzle__users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzle"."quizzle__text_question_settings" ADD CONSTRAINT "quizzle__text_question_settings_question_id_quizzle__questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "quizzle"."quizzle__questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_userId_idx" ON "quizzle"."quizzle__accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_userId_idx" ON "quizzle"."quizzle__sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verifications_identifier_idx" ON "quizzle"."quizzle__verifications" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "question_options_question_idx" ON "quizzle"."quizzle__question_options" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "quizzes_creator_idx" ON "quizzle"."quizzle__questions" USING btree ("creator_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_uidx" ON "quizzle"."quizzle__users" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_uidx" ON "quizzle"."quizzle__users" USING btree ("email");