import { db } from './src/db/index.ts';
import { tenants, users, customers, products, orders, invoices, payments } from './src/db/schema.ts';
import { eq } from 'drizzle-orm';

async function test() {
  const tenantId = '72d88179-c85f-4e09-a1b0-dd9f6e6ae121';
  
  const c = await db.select().from(customers).where(eq(customers.tenantId, tenantId)).limit(1);
  const me = await db.select().from(users).where(eq(users.email, "alnatour.m@gmail.com")).limit(1);
  const prods = await db.select().from(products).where(eq(products.tenantId, tenantId));
  
  console.log("Customer:", c[0]?.name);
  console.log("Me:", me[0]?.name);
  console.log("Products:", prods.map(p => p.name));
  
  process.exit(0);
}

test().catch(console.error);
