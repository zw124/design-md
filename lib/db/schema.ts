import { pgTable, text, timestamp, serial, varchar, integer, boolean, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  legacyUserId: varchar('clerk_id', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
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

export const usersRelations = relations(users, ({ many }) => ({
  generations: many(generations),
}));

export const generationsRelations = relations(generations, ({ one }) => ({
  user: one(users, {
    fields: [generations.userId],
    references: [users.id],
  }),
}));
