import { InferSelectModel, relations } from 'drizzle-orm'
import {
  pgEnum,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: text('user_id').notNull().unique(),
  email: text('email').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const usersRelation = relations(users, ({ many }) => ({
  usersToTeams: many(usersOnTeams),
  videos: many(videos),
  uploads: many(uploads),
  cuepoints: many(cuepoints),
  usersToSessions: many(sessionAttendees),
}))

export type SelectUsers = InferSelectModel<typeof users>

export const teams = pgTable('teams', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: text('org_id').notNull().unique(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  logo: text('logo'),
  description: text('description'),
})

export const teamsRelation = relations(teams, ({ many }) => ({
  usersToTeams: many(usersOnTeams),
  videos: many(videos),
}))

export type SelectTeam = InferSelectModel<typeof teams>

export const usersOnTeams = pgTable(
  'usersOnTeams',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.clerkId),
    teamId: text('team_id')
      .notNull()
      .references(() => teams.clerkId),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.teamId),
  })
)

export const usersOnTeamsRelations = relations(usersOnTeams, ({ one }) => ({
  user: one(users, {
    fields: [usersOnTeams.userId],
    references: [users.clerkId],
  }),
  team: one(teams, {
    fields: [usersOnTeams.teamId],
    references: [teams.clerkId],
  }),
}))

export const uploadStatusEnum = pgEnum('uploadStatus', [
  'preparing',
  'ready',
  'errored',
])

export const videoTypeEnum = pgEnum('videoType', [
  'Match',
  'Friendly',
  'Training',
  'Misc',
])

export const uploads = pgTable('uploads', {
  id: uuid('id').defaultRandom().primaryKey(),
  uploadId: text('upload_id').notNull(),
  uploadUrl: text('upload_url').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  teamId: uuid('team_id')
    .notNull()
    .references(() => teams.id),
  clerkUserId: text('clerk_user_id')
    .notNull()
    .references(() => users.clerkId),
  clerkTeamId: text('clerk_team_id')
    .notNull()
    .references(() => teams.clerkId),
  uploadStatus: uploadStatusEnum('upload_status')
    .notNull()
    .default('preparing'),
  videoTypeEnum: videoTypeEnum('video_type').notNull().default('Match'),
  videoName: text('video_name').notNull(),
  videoDescription: text('video_description').notNull(),
  videoLocation: text('video_location').notNull(),
  videoDate: timestamp('video_date').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const uploadsRelations = relations(uploads, ({ one }) => ({
  uploader: one(users, {
    references: [users.id],
    fields: [uploads.userId],
  }),
}))

export const videoStatusEnum = pgEnum('videoStatus', [
  'preparing',
  'ready',
  'errored',
])

export const videos = pgTable('videos', {
  id: uuid('id').defaultRandom().primaryKey(),
  videoName: text('video_name').notNull(),
  videoUrl: text('video_url').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  teamId: uuid('team_id')
    .notNull()
    .references(() => teams.id),
  sessionId: uuid('session_id').references(() => sessions.id),
  duration: real('duration'),
  quality: text('quality'),
  dimensions: text('dimension'),
  videoStatus: videoStatusEnum('video_status').notNull().default('preparing'),
  uploadId: varchar('upload_id', { length: 256 }).notNull(),
  assetId: varchar('asset_id', { length: 256 }).notNull(),
  visibility: text('visibility'),
  playbackUrl: text('playback_url'),
  clerkUserId: text('clerk_user_id')
    .notNull()
    .references(() => users.clerkId),
  clerkTeamId: text('clerk_team_id')
    .notNull()
    .references(() => teams.clerkId),
  videoTypeEnum: videoTypeEnum('video_type').notNull().default('Match'),
  videoDescription: text('video_description').notNull(),
  videoLocation: text('video_location').notNull(),
  videoDate: timestamp('video_date').notNull(),

  // TODO: Add cuepoints, comments and anyothe relationional data later
  // cuepointsId: varchar("cuepoints_id", { length: 256 }).notNull(),
  // commentsId: varchar("comments_id", { length: 256 }).notNull(),
})

export type SelectVideo = InferSelectModel<typeof videos>

export const videoRelations = relations(videos, ({ one, many }) => ({
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
  cuepoints: many(cuepoints),
  session: one(sessions, {
    fields: [videos.sessionId],
    references: [sessions.id],
  }),
}))

export const playCategory = pgEnum('playCategory', [
  'goal',
  'shot',
  'save',
  'tackle',
  'pass',
  'foul',
  'corner',
  'penalty',
])

export const cuepoints = pgTable('cuepoints', {
  id: uuid('id').defaultRandom().primaryKey(),
  videoId: uuid('video_id')
    .notNull()
    .references(() => videos.id, { onDelete: 'cascade' }),
  taggerId: uuid('tagger_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  time: real('time').notNull(),
  description: text('description').default(''),
  playCategory: playCategory('play_category').notNull(),
})

export const cuepointsRelations = relations(cuepoints, ({ one }) => ({
  video: one(videos, {
    fields: [cuepoints.videoId],
    references: [videos.id],
  }),
  tagger: one(users, {
    fields: [cuepoints.taggerId],
    references: [users.id],
  }),
}))

export type Cuepoints = InferSelectModel<typeof cuepoints>

export const sessionCategory = pgEnum('sessionCategory', [
  'match',
  'friendly',
  'training',
  'recreational',
  'camp',
  'meeting',
  'other',
])

export const sessionStatus = pgEnum('sessionStatus', [
  'scheduled',
  'confirmed',
  'in_progress',
  'cancelled',
  'completed',
])

export type SelectSessions = InferSelectModel<typeof sessions>

export const sessions = pgTable('session', {
  id: uuid('id').defaultRandom().primaryKey(),
  session_name: text('session_name').notNull(),
  session_description: text('session_description'),
  teamId: text('team_id').references(() => teams.clerkId),
  organiserId: text('organiser_id').references(() => users.clerkId),
  session_start_date: timestamp('session_start_date').notNull(),
  session_end_date: timestamp('session_end_date').notNull(),
  // startTime: timestamp('start_time').notNull(),
  // endTime: timestamp('end_time').notNull(),
  location: text('location').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  sessionStatus: sessionStatus('session_status').notNull().default('scheduled'),
  sessionCategory: sessionCategory('session_category').notNull(),
})

export const sessionRelations = relations(sessions, ({ many, one }) => ({
  usersToSessions: many(sessionAttendees),
  videos: many(videos),
  team: one(teams, {
    fields: [sessions.teamId],
    references: [teams.clerkId],
  }),
  organiser: one(users, {
    fields: [sessions.organiserId],
    references: [users.clerkId],
  }),
}))

export const sessionIntentionStatus = pgEnum('sessionIntentionStatus', [
  'undecided',
  'tentative',
  'attending',
  'not_attending',
])

export const sessionAttendees = pgTable(
  'sessionAttendees',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.clerkId),
    sessionId: uuid('session_id')
      .notNull()
      .references(() => sessions.id),
    sessionIntentionStatus: sessionIntentionStatus('session_intention_status')
      .notNull()
      .default('undecided'),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.sessionId),
  })
)

export const sessionAttendeesRelations = relations(
  sessionAttendees,
  ({ one }) => ({
    user: one(users, {
      fields: [sessionAttendees.userId],
      references: [users.clerkId],
    }),
    session: one(sessions, {
      fields: [sessionAttendees.sessionId],
      references: [sessions.id],
    }),
  })
)
