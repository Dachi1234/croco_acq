CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"locale" varchar(5) NOT NULL,
	"linked_translation_id" uuid,
	"title" varchar(500) NOT NULL,
	"excerpt" text,
	"cover_image" varchar(1000),
	"blocks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"meta_title" varchar(500),
	"meta_description" text,
	"og_image" varchar(1000),
	"canonical_url" varchar(1000),
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "articles_slug_locale_unique" UNIQUE("slug","locale")
);
--> statement-breakpoint
CREATE TABLE "homepage_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"locale" varchar(5) NOT NULL,
	"hero_slides" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"cta_banner" jsonb,
	"featured_promotions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"featured_articles" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "homepage_config_locale_unique" UNIQUE("locale")
);
--> statement-breakpoint
CREATE TABLE "promotions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"locale" varchar(5) NOT NULL,
	"linked_translation_id" uuid,
	"title" varchar(500) NOT NULL,
	"excerpt" text,
	"cover_image" varchar(1000),
	"blocks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"meta_title" varchar(500),
	"meta_description" text,
	"og_image" varchar(1000),
	"canonical_url" varchar(1000),
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "promotions_slug_locale_unique" UNIQUE("slug","locale")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"registration_url" varchar(1000),
	"site_name" varchar(255),
	"default_og_image" varchar(1000),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "uploads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" varchar(500) NOT NULL,
	"original_name" varchar(500) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"size_bytes" integer NOT NULL,
	"url" varchar(1000) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_linked_translation_id_articles_id_fk" FOREIGN KEY ("linked_translation_id") REFERENCES "public"."articles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_linked_translation_id_promotions_id_fk" FOREIGN KEY ("linked_translation_id") REFERENCES "public"."promotions"("id") ON DELETE no action ON UPDATE no action;