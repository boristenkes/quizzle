CREATE TABLE "quizzle"."quiz_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TYPE "quizzle"."question_difficulty" RENAME TO "difficulty";--> statement-breakpoint
ALTER TABLE "quizzle"."questions" ALTER COLUMN "difficulty" SET DATA TYPE "quizzle"."difficulty";--> statement-breakpoint
ALTER TABLE "quizzle"."questions" ALTER COLUMN "difficulty" SET DEFAULT 'easy';--> statement-breakpoint
ALTER TABLE "quizzle"."quizzes" ADD COLUMN "difficulty" "quizzle"."difficulty" DEFAULT 'easy';--> statement-breakpoint
ALTER TABLE "quizzle"."quizzes" ADD COLUMN "category_id" text;--> statement-breakpoint
CREATE INDEX "quiz_categories_slug" ON "quizzle"."quiz_categories" USING btree ("slug");--> statement-breakpoint
ALTER TABLE "quizzle"."quizzes" ADD CONSTRAINT "quizzes_category_id_quiz_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "quizzle"."quiz_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint