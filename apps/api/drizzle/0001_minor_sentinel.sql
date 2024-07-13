ALTER TABLE "players" ADD COLUMN "challenge" text NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "signature_verified" boolean;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "worldcoin_verified" boolean;