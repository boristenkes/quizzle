CREATE TABLE "quizzle"."quiz_statistics" (
	"quiz_id" text PRIMARY KEY NOT NULL,
	"attempts_count" integer DEFAULT 0 NOT NULL,
	"average_score" integer DEFAULT 0 NOT NULL,
	"average_time_ms" integer DEFAULT 0 NOT NULL,
	"fastest_time_ms" integer DEFAULT 0 NOT NULL,
	"average_rating" real DEFAULT 0 NOT NULL,
	"reviews_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "quizzle"."quiz_statistics" ADD CONSTRAINT "quiz_statistics_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "quizzle"."quizzes"("id") ON DELETE cascade ON UPDATE no action;