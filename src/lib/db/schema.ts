import {
  pgEnum,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: text("user_id").notNull(),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const teams = pgTable("teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: text("org_id").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  logo: text("logo"),
});

export const uploadStatusEnum = pgEnum("uploadStatus", [
  "preparing",
  "ready",
  "errored",
]);

export const uploads = pgTable("uploads", {
  id: uuid("id").defaultRandom().primaryKey(),
  uploadId: text("upload_id").notNull(),
  uploadUrl: text("upload_url").notNull(),
  userId: text("user_id").notNull(),
  teamId: text("team_id").notNull(),
  uploadStatus: uploadStatusEnum("upload_status")
    .notNull()
    .default("preparing"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const videoStatusEnum = pgEnum("videoStatus", [
  "preparing",
  "ready",
  "errored",
]);

export const videos = pgTable("videos", {
  id: uuid("id").defaultRandom().primaryKey(),
  videoName: text("video_name").notNull(),
  videoUrl: text("video_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  teamId: varchar("team_id", { length: 256 }).notNull(),
  duration: real("duration"),
  quality: text("quality"),
  dimensions: text("dimension"),
  videoStatus: videoStatusEnum("video_status").notNull().default("preparing"),
  uploadId: varchar("upload_id", { length: 256 }).notNull(),
  assetId: varchar("asset_id", { length: 256 }).notNull(),
  visibility: text("visibility"),
  playbackUrl: text("playback_url"),
  // TODO: Add cuepoints, comments and anyothe relationional data later
  // cuepointsId: varchar("cuepoints_id", { length: 256 }).notNull(),
  // commentsId: varchar("comments_id", { length: 256 }).notNull(),
});
