import { pgTable, text, timestamp, serial, varchar, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: varchar('clerk_id', { length: 255 }).unique().notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  subscriptionTier: varchar('subscription_tier', { length: 50 }).default('free'), // free, pro, enterprise
  generationsLeft: integer('generations_left').default(5), // free tier limit
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const generations = pgTable('generations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  prompt: text('prompt').notNull(),
  generatedText: text('generated_text').notNull(),
  generatedImage: varchar('generated_image', { length: 500 }), // URL to generated image
  model: varchar('model', { length: 100 }).default('claude-opus-4'),
  temperature: varchar('temperature', { length: 20 }).default('0.7'),
  style: varchar('style', { length: 100 }).default('realistic'), // For image generation
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
