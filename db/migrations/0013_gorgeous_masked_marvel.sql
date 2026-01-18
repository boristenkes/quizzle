ALTER TABLE "quizzle"."quizzes" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "quizzes_category_idx" ON "quizzle"."quizzes" USING btree ("category_id");