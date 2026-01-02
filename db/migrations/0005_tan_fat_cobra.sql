ALTER TYPE "quizzle"."quizzle__question_type" RENAME TO "question_type";--> statement-breakpoint
ALTER TYPE "quizzle"."quizzle__quiz_difficulty" RENAME TO "quiz_difficulty";--> statement-breakpoint
ALTER TYPE "quizzle"."quizzle__user_role" RENAME TO "user_role";--> statement-breakpoint
ALTER TABLE "quizzle"."quizzle__accounts" RENAME TO "accounts";--> statement-breakpoint
ALTER TABLE "quizzle"."quizzle__sessions" RENAME TO "sessions";--> statement-breakpoint
ALTER TABLE "quizzle"."quizzle__verifications" RENAME TO "verifications";--> statement-breakpoint
ALTER TABLE "quizzle"."quizzle__question_options" RENAME TO "question_options";--> statement-breakpoint
ALTER TABLE "quizzle"."quizzle__questions" RENAME TO "questions";--> statement-breakpoint
ALTER TABLE "quizzle"."quizzle__text_question_settings" RENAME TO "text_question_settings";--> statement-breakpoint
ALTER TABLE "quizzle"."quizzle__users" RENAME TO "users";--> statement-breakpoint
ALTER TABLE "quizzle"."sessions" DROP CONSTRAINT "quizzle__sessions_token_unique";--> statement-breakpoint
ALTER TABLE "quizzle"."users" DROP CONSTRAINT "quizzle__users_username_unique";--> statement-breakpoint
ALTER TABLE "quizzle"."users" DROP CONSTRAINT "quizzle__users_email_unique";--> statement-breakpoint
ALTER TABLE "quizzle"."accounts" DROP CONSTRAINT "quizzle__accounts_user_id_quizzle__users_id_fk";
--> statement-breakpoint
ALTER TABLE "quizzle"."sessions" DROP CONSTRAINT "quizzle__sessions_user_id_quizzle__users_id_fk";
--> statement-breakpoint
ALTER TABLE "quizzle"."question_options" DROP CONSTRAINT "quizzle__question_options_question_id_quizzle__questions_id_fk";
--> statement-breakpoint
ALTER TABLE "quizzle"."questions" DROP CONSTRAINT "quizzle__questions_creator_id_quizzle__users_id_fk";
--> statement-breakpoint
ALTER TABLE "quizzle"."text_question_settings" DROP CONSTRAINT "quizzle__text_question_settings_question_id_quizzle__questions_id_fk";
--> statement-breakpoint
ALTER TABLE "quizzle"."accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "quizzle"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzle"."sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "quizzle"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzle"."question_options" ADD CONSTRAINT "question_options_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "quizzle"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzle"."questions" ADD CONSTRAINT "questions_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "quizzle"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzle"."text_question_settings" ADD CONSTRAINT "text_question_settings_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "quizzle"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzle"."sessions" ADD CONSTRAINT "sessions_token_unique" UNIQUE("token");--> statement-breakpoint
ALTER TABLE "quizzle"."users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");--> statement-breakpoint
ALTER TABLE "quizzle"."users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");