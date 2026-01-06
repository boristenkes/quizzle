CREATE TYPE "quizzle"."question_difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "quizzle"."question_type" AS ENUM('multi_correct', 'single_correct', 'text');--> statement-breakpoint
CREATE TYPE "quizzle"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "quizzle"."accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizzle"."sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "quizzle"."verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizzle"."question_options" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"value" text NOT NULL,
	"is_correct" boolean DEFAULT false NOT NULL,
	"question_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizzle"."questions" (
	"id" text PRIMARY KEY NOT NULL,
	"prompt" text NOT NULL,
	"type" "quizzle"."question_type" NOT NULL,
	"explanation_html" text,
	"quiz_id" text NOT NULL,
	"order" integer NOT NULL,
	"difficulty" "quizzle"."question_difficulty" DEFAULT 'easy' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizzle"."quizzes" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"time_limit_seconds" integer,
	"total_points" integer DEFAULT 100 NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"creator_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "quizzle"."text_question_settings" (
	"question_id" text PRIMARY KEY NOT NULL,
	"acceptable_answers" text[] NOT NULL,
	"ignore_case" boolean DEFAULT true,
	"trim_whitespace" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "quizzle"."users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"name" text NOT NULL,
	"password_hash" text,
	"role" "quizzle"."user_role" DEFAULT 'user' NOT NULL,
	"image" text,
	"display_username" text,
	"bio" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "quizzle"."accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "quizzle"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzle"."sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "quizzle"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzle"."question_options" ADD CONSTRAINT "question_options_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "quizzle"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzle"."questions" ADD CONSTRAINT "questions_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "quizzle"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzle"."quizzes" ADD CONSTRAINT "quizzes_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "quizzle"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzle"."text_question_settings" ADD CONSTRAINT "text_question_settings_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "quizzle"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_userId_idx" ON "quizzle"."accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_userId_idx" ON "quizzle"."sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verifications_identifier_idx" ON "quizzle"."verifications" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "question_options_question_idx" ON "quizzle"."question_options" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "questions_quiz_idx" ON "quizzle"."questions" USING btree ("quiz_id");--> statement-breakpoint
CREATE INDEX "quizzes_creator_idx" ON "quizzle"."quizzes" USING btree ("creator_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_uidx" ON "quizzle"."users" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_uidx" ON "quizzle"."users" USING btree ("email");