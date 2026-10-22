ALTER TABLE "quizzle"."quiz_attempts" DROP CONSTRAINT "quiz_attempts_quiz_id_quizzes_id_fk";
--> statement-breakpoint
ALTER TABLE "quizzle"."quiz_attempts" ALTER COLUMN "quiz_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "quizzle"."quiz_statistics" ALTER COLUMN "average_score" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "quizzle"."quiz_attempts" ADD CONSTRAINT "quiz_attempts_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "quizzle"."quizzes"("id") ON DELETE set null ON UPDATE no action;