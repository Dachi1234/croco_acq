ALTER TABLE "articles" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "promotions" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
CREATE INDEX "articles_locale_idx" ON "articles" USING btree ("locale");--> statement-breakpoint
CREATE INDEX "articles_status_idx" ON "articles" USING btree ("status");--> statement-breakpoint
CREATE INDEX "articles_published_at_idx" ON "articles" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "promotions_locale_idx" ON "promotions" USING btree ("locale");--> statement-breakpoint
CREATE INDEX "promotions_status_idx" ON "promotions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "promotions_published_at_idx" ON "promotions" USING btree ("published_at");
