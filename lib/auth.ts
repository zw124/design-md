import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { assertDatabaseConfigured, db } from '@/lib/db';
import { users } from '@/lib/db/schema';

export async function getOrCreateCurrentUser() {
  assertDatabaseConfigured();
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) {
    throw new Error('Signed-in Clerk user does not have an email address.');
  }

  const existing = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkUser.id),
  });

  const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || clerkUser.username || null;

  if (existing) {
    const [updated] = await db
      .update(users)
      .set({
        email,
        name,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existing.id))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(users)
    .values({
      clerkId: clerkUser.id,
      email,
      name,
      subscriptionTier: 'free',
      subscriptionStatus: 'inactive',
      generationsLimit: 3,
    })
    .returning();

  return created;
}
