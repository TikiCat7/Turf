import {
  integer,
  pgEnum,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const clips = pgTable("clips", {
  id: serial("id").primaryKey(),
  clipName: text("clip_name").notNull(),
  clipUrl: text("clip_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  clipKey: text("clip_key").notNull(),
});

export const uploadStatusEnum = pgEnum("uploadStatus", [
  "preparing",
  "ready",
  "errored",
]);

export const uploads = pgTable("uploads", {
  id: serial("id").primaryKey(),
  uploadId: text("upload_id").notNull(),
  uploadUrl: text("upload_url").notNull(),
  userId: text("user_id").notNull(),
  teamId: text("team_id").notNull(),
  uploadStatus: uploadStatusEnum("upload_status")
    .notNull()
    .default("preparing"),
});

export const videoStatusEnum = pgEnum("videoStatus", [
  "preparing",
  "ready",
  "errored",
]);

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
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
