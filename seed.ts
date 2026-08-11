import { db } from './src/db/index.js';
import { tenants, customers, orders, visits, users } from './src/db/schema.js';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('Seeding...');
  const allTenants = await db.select().from(tenants).limit(1);
  if (allTenants.length === 0) {
    console.log('No tenants found.');
    process.exit(1);
  }
  
  const tenantId = allTenants[0].id;
  console.log('Using tenant:', tenantId);
  
  const newCustomer = await db.insert(customers).values({
    tenantId,
    name: 'ABC Supermarket',
    customerCode: 'C-1001',
    type: 'Supermarket',
    territory: 'North Area',
    phone: '+962 7 9123 4567',
    address: 'Amman, Jordan',
    balance: '1250.00',
    status: 'active'
  }).returning();
  
  console.log('Created customer:', newCustomer[0].id);
  
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
