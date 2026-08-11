import { db } from './index.ts';
import { users, tenants } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, name: string) {
  // 1. Get or create a default tenant
  let defaultTenantId: string;
  const existingTenants = await db.select().from(tenants).limit(1);
  if (existingTenants.length > 0) {
    defaultTenantId = existingTenants[0].id;
  } else {
    const newTenant = await db.insert(tenants)
      .values({
        name: 'OSales Default Company',
        industry: 'FMCG',
        subscriptionPlan: 'Enterprise'
      })
      .returning();
    defaultTenantId = newTenant[0].id;
  }

  // 2. Upsert user based on uid
  // Note: pg upsert with Drizzle on non-primary key requires a unique constraint.
  // We added `uid` as unique in schema.
  
  // First, let's try to find if a user exists with this UID
  const existingUser = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
  if (existingUser.length > 0) {
    return existingUser[0];
  }

  // Next, try to find by email if we don't have UID (e.g. they were seeded manually)
  const existingEmailUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existingEmailUser.length > 0) {
    const updated = await db.update(users)
      .set({ uid })
      .where(eq(users.id, existingEmailUser[0].id))
      .returning();
    return updated[0];
  }

  // Create new user
  const newUser = await db.insert(users)
    .values({
      uid,
      email,
      name: name || 'Unknown User',
      tenantId: defaultTenantId,
      role: 'superadmin', // First user is superadmin
    })
    .returning();
    
  return newUser[0];
}
