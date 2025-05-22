import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Feed schema for storing feed items
export const feedItems = pgTable("feed_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  link: text("link").notNull(),
  pubDate: text("pub_date").notNull(),
  content: text("content").notNull(),
  contentSnippet: text("content_snippet"),
  author: text("author"),
  isoDate: text("iso_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFeedItemSchema = createInsertSchema(feedItems).omit({
  id: true,
  createdAt: true,
});

export type InsertFeedItem = z.infer<typeof insertFeedItemSchema>;
export type FeedItem = typeof feedItems.$inferSelect;

// Original user schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
