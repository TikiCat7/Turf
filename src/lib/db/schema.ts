import { InferSelectModel, relations } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  real,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: text("user_id").notNull().unique(),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const usersRelation = relations(users, ({ many }) => ({
  teams: many(usersOnTeams),
  videos: many(videos),
  uploads: many(uploads),
}));

export const teams = pgTable("teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: text("org_id").notNull().unique(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  logo: text("logo"),
});

export const teamsRelation = relations(teams, ({ many }) => ({
  members: many(usersOnTeams),
  videos: many(videos),
}));

export const usersOnTeams = pgTable(
  "usersOnTeams",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.clerkId),
    teamId: text("team_id")
      .notNull()
      .references(() => teams.clerkId),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.teamId),
  }),
);

export const usersOnTeamsRelations = relations(usersOnTeams, ({ one }) => ({
  user: one(users, {
    fields: [usersOnTeams.userId],
    references: [users.clerkId],
  }),
  team: one(teams, {
    fields: [usersOnTeams.teamId],
    references: [teams.clerkId],
  }),
}));

export const uploadStatusEnum = pgEnum("uploadStatus", [
  "preparing",
  "ready",
  "errored",
]);

export const uploads = pgTable("uploads", {
  id: uuid("id").defaultRandom().primaryKey(),
  uploadId: text("upload_id").notNull(),
  uploadUrl: text("upload_url").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  teamId: uuid("team_id")
    .notNull()
    .references(() => teams.id),
  uploadStatus: uploadStatusEnum("upload_status")
    .notNull()
    .default("preparing"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const uploadsRelations = relations(uploads, ({ one }) => ({
  uploader: one(users, {
    references: [users.id],
    fields: [uploads.userId],
  }),
}));

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
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  teamId: uuid("team_id")
    .notNull()
    .references(() => teams.id),
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

export type SelectVideo = InferSelectModel<typeof videos>;

export const videoRelations = relations(videos, ({ one }) => ({
  uploader: one(users, {
    fields: [videos.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [videos.teamId],
    references: [teams.id],
  }),
  upload: one(uploads, {
    fields: [videos.uploadId],
    references: [uploads.uploadId],
  }),
}));
