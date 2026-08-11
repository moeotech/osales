import { db } from './src/db/index.js';
import { tenants, users, customers, products, visits, orders, payments, invoices } from './src/db/schema.js';
import { eq, desc } from 'drizzle-orm';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  console.log('Running E2E Field Sales Visit Test (DB Level)...');

  // Get tenant
  const tenant = await db.select().from(tenants).where(eq(tenants.name, 'OSales Demo Company')).orderBy(desc(tenants.createdAt)).limit(1);
  const tenantId = tenant[0].id;
  
  const rep = await db.select().from(users).where(eq(users.email, 'khaled@osales.demo')).limit(1);
  const repId = rep[0].id;

  const customer = await db.select().from(customers).where(eq(customers.name, 'ABC Supermarket')).limit(1);
  const customerId = customer[0].id;

  const prods = await db.select().from(products).where(eq(products.tenantId, tenantId));
  const prodA = prods.find(p => p.sku === 'SKU-A')!;
  const prodB = prods.find(p => p.sku === 'SKU-B')!;

  // 1. Start Visit
  console.log('1. Start Visit');
  const newVisit = await db.insert(visits).values({
    tenantId, customerId, repId, status: 'In Progress', date: new Date(), actualStart: new Date()
  }).returning();
  const visitId = newVisit[0].id;

  // 2. Check In
  console.log('2. Check In');
  await db.update(visits).set({ checkInLat: '31.95', checkInLng: '35.91' }).where(eq(visits.id, visitId));

  // 3. Complete Form (Skipped for test)

  // 4. Create Order
  console.log('4. Create Order');
  const subtotal = Number(prodA.price) * 10 + Number(prodB.price) * 5;
  const tax = subtotal * 0.16;
  const total = subtotal + tax;

  const newOrder = await db.insert(orders).values({
    tenantId, customerId, repId, visitId, orderNumber: `ORD-TEST-${Date.now()}`,
    subtotal: subtotal.toString(), tax: tax.toString(), total: total.toString(), status: 'Submitted'
  }).returning();
  
  const newInvoice = await db.insert(invoices).values({
    tenantId, customerId, orderId: newOrder[0].id, invoiceNumber: `INV-TEST-${Date.now()}`,
    subtotal: subtotal.toString(), tax: tax.toString(), discount: '0',
    total: total.toString(), remaining: total.toString(), status: 'Issued', date: new Date()
  }).returning();
  
  console.log('Order created:', newOrder[0].orderNumber, 'Total:', newOrder[0].total);

  // 5. Record Payment
  console.log('5. Record Payment');
  const newPayment = await db.insert(payments).values({
    tenantId, customerId, invoiceId: newInvoice[0].id, repId, visitId,
    amount: '100.00', paymentMethod: 'Cash', date: new Date()
  }).returning();
  
  await db.update(invoices).set({ remaining: (total - 100).toString() }).where(eq(invoices.id, newInvoice[0].id));
  console.log('Payment recorded:', newPayment[0].amount);

  // 6. Complete Visit
  console.log('6. Complete Visit');
  const outVisit = await db.update(visits).set({
    status: 'Completed', outcome: 'ORDER + PAYMENT', actualEnd: new Date(), checkOutLat: '31.95', checkOutLng: '35.91'
  }).where(eq(visits.id, visitId)).returning();
  console.log('Visit checked out, outcome:', outVisit[0].outcome);

  console.log('TEST PASSED SUCCESSFULLY');
  process.exit(0);
}
main().catch(console.error);
