import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core'

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  username: text('username').notNull(),
  favoritesIDs: integer('favoritesIDs').array().notNull().default([]),
  myReviewsIDs: integer('myReviewsIDs').array().notNull().default([]),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
})