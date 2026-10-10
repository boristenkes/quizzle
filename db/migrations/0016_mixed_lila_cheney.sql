ALTER TABLE "quizzle"."quiz_attempt_questions" ADD COLUMN "submitted_answer" json;--> statement-breakpoint
ALTER TABLE "quizzle"."quiz_attempts" ADD COLUMN "quiz_data" json NOT NULL;