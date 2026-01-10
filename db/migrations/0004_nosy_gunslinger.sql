CREATE TABLE "quizzle"."reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"comment" text,
	"rating" integer NOT NULL,
	"quiz_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reviews_rating_check" CHECK ("quizzle"."reviews"."rating" between 1 and 5)
);
--> statement-breakpoint
ALTER TABLE "quizzle"."reviews" ADD CONSTRAINT "reviews_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "quizzle"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzle"."reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "quizzle"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reviews_quiz_idx" ON "quizzle"."reviews" USING btree ("quiz_id");--> statement-breakpoint
CREATE INDEX "reviews_user_idx" ON "quizzle"."reviews" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "reviews_quiz_user_uidx" ON "quizzle"."reviews" USING btree ("quiz_id","user_id");