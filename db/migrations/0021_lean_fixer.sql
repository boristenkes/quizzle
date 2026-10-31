CREATE TYPE "quizzle"."notification_type" AS ENUM('new_follower', 'new_attempt', 'new_review');--> statement-breakpoint
CREATE TABLE "quizzle"."notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"type" "quizzle"."notification_type" NOT NULL,
	"issuer_id" text NOT NULL,
	"recipient_id" text NOT NULL,
	"quiz_id" text,
	"review_id" text,
	"attempt_id" text,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "notifications_not_self_chk" CHECK ("quizzle"."notifications"."issuer_id" <> "quizzle"."notifications"."recipient_id"),
	CONSTRAINT "notifications_type_fields_chk" CHECK ((
				("quizzle"."notifications"."type" = 'new_follower'
					AND "quizzle"."notifications"."quiz_id" IS NULL
					AND "quizzle"."notifications"."review_id" IS NULL
					AND "quizzle"."notifications"."attempt_id" IS NULL)
				OR
				("quizzle"."notifications"."type" = 'new_review'
					AND "quizzle"."notifications"."quiz_id" IS NOT NULL
					AND "quizzle"."notifications"."review_id" IS NOT NULL
					AND "quizzle"."notifications"."attempt_id" IS NULL)
				OR
				("quizzle"."notifications"."type" = 'new_attempt'
					AND "quizzle"."notifications"."quiz_id" IS NOT NULL
					AND "quizzle"."notifications"."attempt_id" IS NOT NULL
					AND "quizzle"."notifications"."review_id" IS NULL)
			))
);
--> statement-breakpoint
ALTER TABLE "quizzle"."notifications" ADD CONSTRAINT "notifications_issuer_id_users_id_fk" FOREIGN KEY ("issuer_id") REFERENCES "quizzle"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzle"."notifications" ADD CONSTRAINT "notifications_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "quizzle"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzle"."notifications" ADD CONSTRAINT "notifications_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "quizzle"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzle"."notifications" ADD CONSTRAINT "notifications_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "quizzle"."reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzle"."notifications" ADD CONSTRAINT "notifications_attempt_id_quiz_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "quizzle"."quiz_attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "notifications_recipient_created_idx" ON "quizzle"."notifications" USING btree ("recipient_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "notifications_quiz_idx" ON "quizzle"."notifications" USING btree ("quiz_id");--> statement-breakpoint
CREATE INDEX "notifications_issuer_recipient_idx" ON "quizzle"."notifications" USING btree ("issuer_id","recipient_id");--> statement-breakpoint
CREATE UNIQUE INDEX "notifications_unique_follower_idx" ON "quizzle"."notifications" USING btree ("issuer_id","recipient_id") WHERE "quizzle"."notifications"."type" = 'new_follower';