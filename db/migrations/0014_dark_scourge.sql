CREATE TABLE "quizzle"."bookmarks" (
	"user_id" text NOT NULL,
	"quiz_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bookmarks_user_id_quiz_id_pk" PRIMARY KEY("user_id","quiz_id")
);
--> statement-breakpoint
ALTER TABLE "quizzle"."bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "quizzle"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzle"."bookmarks" ADD CONSTRAINT "bookmarks_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "quizzle"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bookmarks_quiz_idx" ON "quizzle"."bookmarks" USING btree ("quiz_id");--> statement-breakpoint
CREATE INDEX "bookmarks_user_idx" ON "quizzle"."bookmarks" USING btree ("user_id");