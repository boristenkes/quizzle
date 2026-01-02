ALTER TABLE "quizzle"."quizzle__accounts" ALTER COLUMN "access_token_expires_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "quizzle"."quizzle__accounts" ALTER COLUMN "refresh_token_expires_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "quizzle"."quizzle__sessions" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "quizzle"."quizzle__verifications" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone;