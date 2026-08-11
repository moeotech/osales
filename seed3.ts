import { db } from './src/db/index.js';
import { tenants, users, customers, products, priceLists, customerPriceLists, productPrices } from './src/db/schema.js';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  console.log('Seeding Phase 3 Test Data...');

  const newTenant = await db.insert(tenants).values({
    name: 'OSales Demo Company',
    industry: 'FMCG',
    subscriptionPlan: 'Enterprise'
  }).returning();
  const tenantId = newTenant[0].id;

  const wholesalePL = await db.insert(priceLists).values({ tenantId, name: 'Wholesale' }).returning();
  const retailPL = await db.insert(priceLists).values({ tenantId, name: 'Retail' }).returning();

  const repUser = await db.insert(users).values({
    tenantId, uid: 'demo-rep-' + Date.now(), email: 'khaled@osales.demo', name: 'Khaled', role: 'sales_rep', territory: 'Amman'
  }).returning();

  const customer1 = await db.insert(customers).values({
    tenantId, name: 'ABC Supermarket', type: 'Supermarket', territory: 'Amman', repId: repUser[0].id, creditLimit: '10000', balance: '0'
  }).returning();

  await db.insert(customerPriceLists).values({
    tenantId, customerId: customer1[0].id, priceListId: wholesalePL[0].id
  });

  const prodA = await db.insert(products).values({
    tenantId, sku: 'SKU-A', name: 'Product A', category: 'Beverages', price: '10', cost: '5'
  }).returning();
  
  const prodB = await db.insert(products).values({
    tenantId, sku: 'SKU-B', name: 'Product B', category: 'Beverages', price: '20', cost: '10'
  }).returning();

  await db.insert(productPrices).values({ tenantId, productId: prodA[0].id, priceListId: wholesalePL[0].id, price: '10' });
  await db.insert(productPrices).values({ tenantId, productId: prodB[0].id, priceListId: wholesalePL[0].id, price: '20' });
  await db.insert(productPrices).values({ tenantId, productId: prodA[0].id, priceListId: retailPL[0].id, price: '12' });
  await db.insert(productPrices).values({ tenantId, productId: prodB[0].id, priceListId: retailPL[0].id, price: '24' });

  console.log('Seeding complete. Tenant ID:', tenantId);
  process.exit(0);
}
main().catch(console.error);
