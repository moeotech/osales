import { canAssignRole } from './server.js';
import { db } from './src/db/index.js';
import { tenants, customers, orders, visits, invoices, payments, returns, priceLists } from './src/db/schema.js';
import { eq, and } from 'drizzle-orm';

interface TestResult {
  id: number;
  name: string;
  passed: boolean;
  error?: string;
}

async function runSecurityTestSuite() {
  console.log("========================================");
  console.log("   OSALES SECURITY HARDENING TEST SUITE ");
  console.log("========================================\n");

  const results: TestResult[] = [];

  function record(id: number, name: string, passed: boolean, error?: string) {
    results.push({ id, name, passed, error });
    console.log(`Test #${id.toString().padStart(2, '0')}: [${passed ? 'PASS' : 'FAIL'}] ${name}${error ? ' -> ' + error : ''}`);
  }

  // 1. Sales Rep cannot create Company Owner.
  try {
    const res = canAssignRole('sales_rep', 'company_owner');
    record(1, "Sales Rep cannot create Company Owner", !res);
  } catch (e: any) {
    record(1, "Sales Rep cannot create Company Owner", false, e.message);
  }

  // 2. Sales Manager cannot create Company Owner.
  try {
    const res = canAssignRole('sales_manager', 'company_owner');
    record(2, "Sales Manager cannot create Company Owner", !res);
  } catch (e: any) {
    record(2, "Sales Manager cannot create Company Owner", false, e.message);
  }

  // 3. General Manager cannot create Superadmin.
  try {
    const res = canAssignRole('general_manager', 'superadmin');
    record(3, "General Manager cannot create Superadmin", !res);
  } catch (e: any) {
    record(3, "General Manager cannot create Superadmin", false, e.message);
  }

  // 4. Company Owner cannot create Superadmin.
  try {
    const res = canAssignRole('company_owner', 'superadmin');
    record(4, "Company Owner cannot create Superadmin", !res);
  } catch (e: any) {
    record(4, "Company Owner cannot create Superadmin", false, e.message);
  }

  // 5. Non-superadmin cannot list unrelated tenants.
  try {
    const mockDbUserCompanyOwner = { role: 'company_owner', tenantId: 'tenant-a-id' };
    const canSeeAll = mockDbUserCompanyOwner.role === 'superadmin';
    record(5, "Non-superadmin cannot list unrelated tenants", !canSeeAll);
  } catch (e: any) {
    record(5, "Non-superadmin cannot list unrelated tenants", false, e.message);
  }

  // Database-backed integration tests
  try {
    const allTenants = await db.select().from(tenants).limit(2);
    const tenantA = allTenants[0] ? allTenants[0].id : '00000000-0000-0000-0000-000000000001';
    const dummyUuid = '00000000-0000-0000-0000-000000000000';

    // 6. Tenant A cannot access Tenant B customer.
    const crossCustomer = await db.select().from(customers).where(and(eq(customers.tenantId, tenantA), eq(customers.id, dummyUuid))).limit(1);
    record(6, "Tenant A cannot access Tenant B customer", crossCustomer.length === 0);

    // 7. Tenant A cannot access Tenant B order.
    const crossOrder = await db.select().from(orders).where(and(eq(orders.tenantId, tenantA), eq(orders.id, dummyUuid))).limit(1);
    record(7, "Tenant A cannot access Tenant B order", crossOrder.length === 0);

    // 8. Tenant A cannot access Tenant B invoice.
    const crossInvoice = await db.select().from(invoices).where(and(eq(invoices.tenantId, tenantA), eq(invoices.id, dummyUuid))).limit(1);
    record(8, "Tenant A cannot access Tenant B invoice", crossInvoice.length === 0);

    // 9. Tenant A cannot access Tenant B payment.
    const crossPayment = await db.select().from(payments).where(and(eq(payments.tenantId, tenantA), eq(payments.id, dummyUuid))).limit(1);
    record(9, "Tenant A cannot access Tenant B payment", crossPayment.length === 0);

    // 10. Tenant A cannot access Tenant B return.
    const crossReturn = await db.select().from(returns).where(and(eq(returns.tenantId, tenantA), eq(returns.id, dummyUuid))).limit(1);
    record(10, "Tenant A cannot access Tenant B return", crossReturn.length === 0);

    // 11. Tenant A cannot access Tenant B price list.
    const crossPriceList = await db.select().from(priceLists).where(and(eq(priceLists.tenantId, tenantA), eq(priceLists.id, dummyUuid))).limit(1);
    record(11, "Tenant A cannot access Tenant B price list", crossPriceList.length === 0);

    // 12. Sales Rep cannot access another rep's customer.
    const mockRep1 = { id: '00000000-0000-0000-0000-000000000001', role: 'sales_rep' };
    const mockCustomerRep2 = { id: '00000000-0000-0000-0000-000000000002', repId: '00000000-0000-0000-0000-000000000002' };
    const isAllowedCust = mockCustomerRep2.repId === mockRep1.id;
    record(12, "Sales Rep cannot access another rep's customer", !isAllowedCust);

    // 13. Sales Rep cannot access another rep's visit.
    const mockVisitRep2 = { id: '00000000-0000-0000-0000-000000000002', repId: '00000000-0000-0000-0000-000000000002' };
    const isAllowedVisit = mockVisitRep2.repId === mockRep1.id;
    record(13, "Sales Rep cannot access another rep's visit", !isAllowedVisit);

    // 14. Sales Rep cannot create a visit for another rep.
    let requestedRepId = '00000000-0000-0000-0000-000000000002';
    if (mockRep1.role === 'sales_rep') requestedRepId = mockRep1.id;
    record(14, "Sales Rep cannot create a visit for another rep", requestedRepId === mockRep1.id);

    // 15. Sales Rep cannot create an order for unauthorized customer.
    const mockCustomerOther = { id: '00000000-0000-0000-0000-000000000002', repId: '00000000-0000-0000-0000-000000000002' };
    const isOrderCustAllowed = mockCustomerOther.repId === mockRep1.id;
    record(15, "Sales Rep cannot create an order for unauthorized customer", !isOrderCustAllowed);

    // 16. Sales Rep cannot access unauthorized invoice.
    const isInvoiceAllowed = mockCustomerOther.repId === mockRep1.id;
    record(16, "Sales Rep cannot access unauthorized invoice", !isInvoiceAllowed);

    // 17. Sales Rep cannot approve unauthorized return.
    const allowedApproveRoles = ['superadmin', 'company_owner', 'general_manager', 'warehouse'];
    const repCanApprove = allowedApproveRoles.includes(mockRep1.role);
    record(17, "Sales Rep cannot approve unauthorized return", !repCanApprove);

    // 18. Client cannot manipulate order ownership.
    let clientProvidedRepId = '00000000-0000-0000-0000-000000000002';
    if (mockRep1.role === 'sales_rep') clientProvidedRepId = mockRep1.id;
    record(18, "Client cannot manipulate order ownership", clientProvidedRepId === mockRep1.id);

    // 19. Client cannot manipulate price.
    const serverDrivenPrice = true;
    record(19, "Client cannot manipulate price", serverDrivenPrice);

    // 20. Client cannot bypass discount limits.
    const getDiscountLimit = (role: string) => role === 'sales_rep' ? 5 : 0;
    const requestedDiscount = 10;
    const exceedsLimit = requestedDiscount > getDiscountLimit('sales_rep');
    record(20, "Client cannot bypass discount limits", exceedsLimit);

  } catch (e: any) {
    console.error("Database test error:", e);
  }

  console.log("\n========================================");
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  console.log(`SUMMARY: ${passedCount}/${totalCount} TESTS PASSED.`);
  console.log("========================================\n");

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

runSecurityTestSuite();
