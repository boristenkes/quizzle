CREATE TABLE "quizzle"."quiz_attempt_questions" (
	"id" text PRIMARY KEY NOT NULL,
	"attempt_id" text NOT NULL,
	"question_id" text,
	"question_public" json NOT NULL,
	"question_private" json NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizzle"."quiz_attempts" (
	"id" text PRIMARY KEY NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"max_score" integer NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"submitted_at" timestamp with time zone,
	"is_completed" boolean DEFAULT false NOT NULL,
	"quiz_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "quizzle"."quiz_attempt_questions" ADD CONSTRAINT "quiz_attempt_questions_attempt_id_quiz_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "quizzle"."quiz_attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzle"."quiz_attempt_questions" ADD CONSTRAINT "quiz_attempt_questions_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "quizzle"."questions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzle"."quiz_attempts" ADD CONSTRAINT "quiz_attempts_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "quizzle"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzle"."quiz_attempts" ADD CONSTRAINT "quiz_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "quizzle"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "quiz_attempt_questions__attempt_id" ON "quizzle"."quiz_attempt_questions" USING btree ("attempt_id");--> statement-breakpoint
CREATE INDEX "quiz_attempt_questions__question_id" ON "quizzle"."quiz_attempt_questions" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "quiz_attempts_quiz_idx" ON "quizzle"."quiz_attempts" USING btree ("quiz_id");--> statement-breakpoint
CREATE INDEX "quiz_attempts_user_idx" ON "quizzle"."quiz_attempts" USING btree ("user_id");