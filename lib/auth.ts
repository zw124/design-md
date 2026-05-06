import type { Session } from "next-auth"
import { eq } from "drizzle-orm"
import { assertDatabaseConfigured, db } from "@/lib/db"
import { users } from "@/lib/db/schema"

const userColumns = {
  id: users.id,
  email: users.email,
  name: users.name,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
}

export async function getOrCreateSessionUser(session: Session | null) {
  assertDatabaseConfigured()

  const email = session?.user?.email
  if (!email) return null

  const normalizedEmail = email.toLowerCase()
  const name = session.user?.name || null

  const [existing] = await db
    .select(userColumns)
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1)

  if (existing) {
    const [updated] = await db
      .update(users)
      .set({
        email: normalizedEmail,
        name,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existing.id))
      .returning(userColumns)
    return updated
  }

  try {
    const [created] = await db
      .insert(users)
      .values({
        legacyUserId: normalizedEmail,
        email: normalizedEmail,
        name,
      })
      .returning(userColumns)
    return created
  } catch (error: any) {
    if (error?.code !== "42703") throw error

    const [created] = await db
      .insert(users)
      .values({
        email: normalizedEmail,
        name,
      })
      .returning(userColumns)
    return created
  }
}
