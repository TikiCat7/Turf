import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const clips = pgTable("clips", {
  id: serial("id").primaryKey(),
  clipName: text("clip_name").notNull(),
  clipUrl: text("clip_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  clipKey: text("clip_key").notNull(),
});
