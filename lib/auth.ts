import type { Session } from "next-auth"
import { eq } from "drizzle-orm"
import { assertDatabaseConfigured, db } from "@/lib/db"
import { users } from "@/lib/db/schema"

export async function getOrCreateSessionUser(session: Session | null) {
  assertDatabaseConfigured()

  const email = session?.user?.email
  if (!email) return null

  const authUserId = email.toLowerCase()
  const name = session.user?.name || null

  const existing = await db.query.users.findFirst({
    where: eq(users.authUserId, authUserId),
  })

  if (existing) {
    const [updated] = await db
      .update(users)
      .set({
        email,
        name,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existing.id))
      .returning()
    return updated
  }

  const [created] = await db
    .insert(users)
    .values({
      authUserId,
      email,
      name,
      subscriptionTier: "free",
      subscriptionStatus: "inactive",
      generationsLimit: 3,
    })
    .returning()

  return created
}
