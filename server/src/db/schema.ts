import { relations, sql } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const emptyJsonbArray = sql`'[]'::jsonb`;

function postColumns() {
  return {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull(),
    locale: varchar("locale", { length: 5 }).notNull(),
    linkedTranslationId: uuid("linked_translation_id"),
    title: varchar("title", { length: 500 }).notNull(),
    excerpt: text("excerpt"),
    coverImage: varchar("cover_image", { length: 1000 }),
    blocks: jsonb("blocks").notNull().default(emptyJsonbArray),
    metaTitle: varchar("meta_title", { length: 500 }),
    metaDescription: text("meta_description"),
    ogImage: varchar("og_image", { length: 1000 }),
    canonicalUrl: varchar("canonical_url", { length: 1000 }),
    status: varchar("status", { length: 20 }).notNull().default("draft"),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
  };
}

export const articles = pgTable(
  "articles",
  postColumns(),
  (table) => [
    unique("articles_slug_locale_unique").on(table.slug, table.locale),
    foreignKey({
      columns: [table.linkedTranslationId],
      foreignColumns: [table.id],
    }),
    index("articles_locale_idx").on(table.locale),
    index("articles_status_idx").on(table.status),
    index("articles_published_at_idx").on(table.publishedAt),
  ],
);

export const promotions = pgTable(
  "promotions",
  postColumns(),
  (table) => [
    unique("promotions_slug_locale_unique").on(table.slug, table.locale),
    foreignKey({
      columns: [table.linkedTranslationId],
      foreignColumns: [table.id],
    }),
    index("promotions_locale_idx").on(table.locale),
    index("promotions_status_idx").on(table.status),
    index("promotions_published_at_idx").on(table.publishedAt),
  ],
);

export const homepageConfig = pgTable("homepage_config", {
  id: uuid("id").defaultRandom().primaryKey(),
  locale: varchar("locale", { length: 5 }).notNull().unique(),
  heroSlides: jsonb("hero_slides").notNull().default(emptyJsonbArray),
  ctaBanner: jsonb("cta_banner"),
  featuredPromotions: jsonb("featured_promotions")
    .notNull()
    .default(emptyJsonbArray),
  featuredArticles: jsonb("featured_articles")
    .notNull()
    .default(emptyJsonbArray),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  registrationUrl: varchar("registration_url", { length: 1000 }),
  siteName: varchar("site_name", { length: 255 }),
  defaultOgImage: varchar("default_og_image", { length: 1000 }),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const uploads = pgTable("uploads", {
  id: uuid("id").defaultRandom().primaryKey(),
  filename: varchar("filename", { length: 500 }).notNull(),
  originalName: varchar("original_name", { length: 500 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  url: varchar("url", { length: 1000 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── better-auth tables ──────────────────────────────────────────────

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ── Relations ───────────────────────────────────────────────────────

export const articlesRelations = relations(articles, ({ one }) => ({
  linkedTranslation: one(articles, {
    fields: [articles.linkedTranslationId],
    references: [articles.id],
  }),
}));

export const promotionsRelations = relations(promotions, ({ one }) => ({
  linkedTranslation: one(promotions, {
    fields: [promotions.linkedTranslationId],
    references: [promotions.id],
  }),
}));
