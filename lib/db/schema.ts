import { pgTable, text, timestamp, serial, varchar, integer, boolean, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  authUserId: varchar('auth_user_id', { length: 255 }).unique().notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  lemonSqueezyCustomerId: varchar('lemon_squeezy_customer_id', { length: 255 }),
  lemonSqueezySubscriptionId: varchar('lemon_squeezy_subscription_id', { length: 255 }),
  lemonSqueezyVariantId: varchar('lemon_squeezy_variant_id', { length: 255 }),
  subscriptionTier: varchar('subscription_tier', { length: 50 }).default('free').notNull(),
  subscriptionStatus: varchar('subscription_status', { length: 50 }).default('inactive').notNull(),
  generationsLimit: integer('generations_limit').default(3).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const generations = pgTable('generations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  markdown: text('markdown').notNull(),
  colors: jsonb('colors').$type<Array<{ hex: string; source: string; role?: string; confidence: number }>>(),
  aiStatus: varchar('ai_status', { length: 50 }),
  aiModel: varchar('ai_model', { length: 120 }),
  favorite: boolean('favorite').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const lemonSqueezyEvents = pgTable('lemon_squeezy_events', {
  id: serial('id').primaryKey(),
  eventId: varchar('event_id', { length: 255 }).unique().notNull(),
  eventName: varchar('event_name', { length: 120 }).notNull(),
  payload: jsonb('payload').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  generations: many(generations),
}));

export const generationsRelations = relations(generations, ({ one }) => ({
  user: one(users, {
    fields: [generations.userId],
    references: [users.id],
  }),
}));
