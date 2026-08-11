import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { requireAuth, AuthRequest } from './src/middleware/auth.js';
import { getOrCreateUser } from './src/db/users.js';
import { db } from './src/db/index.js';
import { tenants, customers, orders, visits, payments, invoices, products, returns } from './src/db/schema.js';
import { eq, desc, and } from 'drizzle-orm';
import { users, priceLists, orderItems, customerPriceLists, productPrices, visitNotes, visitPhotos, visitForms, returnItems, productCategories } from './src/db/schema.js';

dotenv.config();

// Role Creation & Promotion Authority Hierarchy
export function canAssignRole(callerRole: string, targetRole: string): boolean {
  if (callerRole === 'superadmin') return true;
  
  if (callerRole === 'company_owner') {
    return ['general_manager', 'sales_manager', 'supervisor', 'sales_rep', 'merchandiser', 'warehouse', 'accountant'].includes(targetRole);
  }
  
  if (callerRole === 'general_manager') {
    return ['sales_manager', 'supervisor', 'sales_rep', 'merchandiser', 'warehouse', 'accountant'].includes(targetRole);
  }
  
  if (callerRole === 'sales_manager') {
    return ['supervisor', 'sales_rep', 'merchandiser'].includes(targetRole);
  }
  
  if (callerRole === 'supervisor') {
    return ['sales_rep', 'merchandiser'].includes(targetRole);
  }
  
  return false;
}

const isSalesRep = (role?: string) => role === 'sales_rep' || role === 'merchandiser';
const isSupervisor = (role?: string) => role === 'supervisor';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Middleware to ensure user belongs to the requested tenant
  const requireTenantAccess = async (req: AuthRequest, res: any, next: any) => {
    const { tenantId } = req.params;
    if (!req.dbUser) {
      return res.status(401).json({ error: 'Unauthorized: User not found in database' });
    }
    if (req.dbUser.role !== 'superadmin' && req.dbUser.tenantId !== tenantId) {
      return res.status(403).json({ error: 'Forbidden: You do not have access to this tenant\'s data' });
    }
    next();
  };

  const authAndTenant = [requireAuth, requireTenantAccess];

  // Middleware for Role-Based Access Control
  const requireRole = (roles: string[]) => {
    return (req: AuthRequest, res: any, next: any) => {
      if (!req.dbUser) {
        return res.status(401).json({ error: 'Unauthorized: User not found in database' });
      }
      if (req.dbUser.role === 'superadmin') {
        return next();
      }
      if (roles.includes(req.dbUser.role)) {
        return next();
      }
      return res.status(403).json({ error: 'Forbidden: Insufficient role permissions' });
    };
  };

  // API Routes
  app.post("/api/auth/sync", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const { uid, email, name } = req.user;
      const dbUser = await getOrCreateUser(uid, email || '', name || '');
      res.json({ user: dbUser });
    } catch (error: any) {
      console.error("Failed to sync user:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // --- Tenants API ---
  app.get("/api/tenants", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.dbUser) return res.status(401).json({ error: 'Unauthorized' });

      if (req.dbUser.role === 'superadmin') {
        const allTenants = await db.select().from(tenants);
        return res.json({ tenants: allTenants });
      } else {
        const myTenant = await db.select().from(tenants).where(eq(tenants.id, req.dbUser.tenantId));
        return res.json({ tenants: myTenant });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Users API ---
  app.get("/api/tenants/:tenantId/users", authAndTenant, async (req: AuthRequest, res) => {
    try {
      const { tenantId } = req.params;
      const allUsers = await db.select().from(users).where(eq(users.tenantId, tenantId)).orderBy(desc(users.createdAt));
      res.json({ users: allUsers });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tenants/:tenantId/users", authAndTenant, requireRole(['superadmin', 'company_owner', 'general_manager', 'sales_manager', 'supervisor']), async (req: AuthRequest, res) => {
    try {
      const { tenantId } = req.params;
      const { name, email, role, status, territory } = req.body;
      const targetRole = role || 'sales_rep';

      if (!canAssignRole(req.dbUser.role, targetRole)) {
        return res.status(403).json({ error: 'Forbidden: You do not have authority to assign role ' + targetRole });
      }

      const newUser = await db.insert(users).values({ 
        tenantId, 
        name, 
        email, 
        role: targetRole, 
        status: status || 'active',
        territory: territory || null
      }).returning();
      res.json({ user: newUser[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/tenants/:tenantId/users/:userId", authAndTenant, async (req: AuthRequest, res) => {
    try {
      const { tenantId, userId } = req.params;
      const { name, email, role, status, territory } = req.body;

      const targetUser = await db.select().from(users).where(and(eq(users.tenantId, tenantId), eq(users.id, userId))).limit(1);
      if (!targetUser.length) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (role && role !== targetUser[0].role) {
        if (!canAssignRole(req.dbUser.role, role)) {
          return res.status(403).json({ error: 'Forbidden: You do not have authority to assign role ' + role });
        }
        if (req.dbUser.role !== 'superadmin' && !canAssignRole(req.dbUser.role, targetUser[0].role)) {
          return res.status(403).json({ error: 'Forbidden: Cannot modify user with higher/equal authority' });
        }
      }

      const updated = await db.update(users).set({
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role }),
        ...(status && { status }),
        ...(territory !== undefined && { territory }),
      }).where(and(eq(users.tenantId, tenantId), eq(users.id, userId))).returning();

      res.json({ user: updated[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Customers API ---
  app.get("/api/tenants/:tenantId/customers", authAndTenant, async (req: AuthRequest, res) => {
    try {
      const { tenantId } = req.params;
      const caller = req.dbUser;

      let query = db.select().from(customers).where(eq(customers.tenantId, tenantId));
      if (isSalesRep(caller.role)) {
        query = db.select().from(customers).where(and(eq(customers.tenantId, tenantId), eq(customers.repId, caller.id)));
      } else if (isSupervisor(caller.role) && caller.territory) {
        query = db.select().from(customers).where(and(eq(customers.tenantId, tenantId), eq(customers.territory, caller.territory)));
      }

      const allCustomers = await query.orderBy(desc(customers.createdAt));
      res.json({ customers: allCustomers });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/tenants/:tenantId/customers/:customerId", authAndTenant, async (req: AuthRequest, res) => {
    try {
      const { tenantId, customerId } = req.params;
      const caller = req.dbUser;

      const customer = await db.select().from(customers).where(and(eq(customers.tenantId, tenantId), eq(customers.id, customerId))).limit(1);
      
      if (!customer.length) {
        return res.status(404).json({ error: "Customer not found" });
      }

      if (isSalesRep(caller.role) && customer[0].repId !== caller.id) {
        return res.status(403).json({ error: "Forbidden: Customer not assigned to you" });
      }
      if (isSupervisor(caller.role) && caller.territory && customer[0].territory !== caller.territory) {
        return res.status(403).json({ error: "Forbidden: Customer outside your territory" });
      }

      const customerOrders = await db.select().from(orders).where(and(eq(orders.tenantId, tenantId), eq(orders.customerId, customerId))).orderBy(desc(orders.date));
      const customerVisits = await db.select().from(visits).where(and(eq(visits.tenantId, tenantId), eq(visits.customerId, customerId))).orderBy(desc(visits.date));
      const customerInvoices = await db.select().from(invoices).where(and(eq(invoices.tenantId, tenantId), eq(invoices.customerId, customerId))).orderBy(desc(invoices.date));
      const customerPayments = await db.select().from(payments).where(and(eq(payments.tenantId, tenantId), eq(payments.customerId, customerId))).orderBy(desc(payments.date));

      const totalSales = customerOrders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + Number(o.total), 0);
      const totalInvoiced = customerInvoices.filter(i => i.status !== 'Cancelled').reduce((sum, i) => sum + Number(i.total), 0);
      const totalPaid = customerPayments.reduce((sum, p) => sum + Number(p.amount), 0);
      const outstanding = customerInvoices.filter(i => i.status !== 'Cancelled').reduce((sum, i) => sum + Number(i.remaining), 0);
      
      const now = new Date();
      const overdue = customerInvoices.filter(i => i.status !== 'Cancelled' && i.dueDate && new Date(i.dueDate) < now).reduce((sum, i) => sum + Number(i.remaining), 0);

      res.json({
        customer: {
          ...customer[0],
          stats: { totalSales, totalInvoiced, totalPaid, outstanding, overdue }
        },
        orders: customerOrders,
        visits: customerVisits,
        invoices: customerInvoices,
        payments: customerPayments
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tenants/:tenantId/customers", authAndTenant, async (req: AuthRequest, res) => {
    try {
      const { tenantId } = req.params;
      const caller = req.dbUser;
      
      let repId = req.body.repId;
      if (isSalesRep(caller.role)) {
        repId = caller.id;
      }

      const newCustomer = await db.insert(customers).values({
        ...req.body,
        tenantId,
        repId: repId || caller.id
      }).returning();
      res.json({ customer: newCustomer[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Price Lists API ---
  app.get("/api/tenants/:tenantId/price-lists", authAndTenant, async (req: AuthRequest, res) => {
    try {
      const { tenantId } = req.params;
      const allLists = await db.select().from(priceLists).where(eq(priceLists.tenantId, tenantId)).orderBy(desc(priceLists.createdAt));
      res.json({ priceLists: allLists });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tenants/:tenantId/price-lists", authAndTenant, requireRole(['superadmin', 'company_owner', 'general_manager', 'sales_manager']), async (req: AuthRequest, res) => {
    try {
      const { tenantId } = req.params;
      const { name, currency } = req.body;
      const newList = await db.insert(priceLists).values({ tenantId, name, currency: currency || 'JOD' }).returning();
      res.json({ priceList: newList[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/tenants/:tenantId/price-lists/:priceListId/products", authAndTenant, async (req: AuthRequest, res) => {
    try {
      const { tenantId, priceListId } = req.params;
      
      const pl = await db.select().from(priceLists).where(and(eq(priceLists.tenantId, tenantId), eq(priceLists.id, priceListId))).limit(1);
      if (!pl.length) return res.status(404).json({ error: 'Price list not found' });

      const prices = await db.select({
        id: productPrices.id,
        productId: products.id,
        productName: products.name,
        price: productPrices.price,
      })
      .from(productPrices)
      .leftJoin(products, and(eq(products.id, productPrices.productId), eq(products.tenantId, tenantId)))
      .where(and(eq(productPrices.tenantId, tenantId), eq(productPrices.priceListId, priceListId)));
      res.json({ products: prices });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tenants/:tenantId/price-lists/:priceListId/products", authAndTenant, requireRole(['superadmin', 'company_owner', 'general_manager', 'sales_manager']), async (req: AuthRequest, res) => {
    try {
      const { tenantId, priceListId } = req.params;
      const { productId, price } = req.body;

      const pl = await db.select().from(priceLists).where(and(eq(priceLists.tenantId, tenantId), eq(priceLists.id, priceListId))).limit(1);
      if (!pl.length) return res.status(404).json({ error: 'Price list not found' });

      const prod = await db.select().from(products).where(and(eq(products.tenantId, tenantId), eq(products.id, productId))).limit(1);
      if (!prod.length) return res.status(404).json({ error: 'Product not found' });

      const existing = await db.select().from(productPrices).where(and(eq(productPrices.tenantId, tenantId), eq(productPrices.priceListId, priceListId), eq(productPrices.productId, productId))).limit(1);
      if (existing.length > 0) {
        const updated = await db.update(productPrices).set({ price: price.toString() }).where(and(eq(productPrices.tenantId, tenantId), eq(productPrices.id, existing[0].id))).returning();
        return res.json({ productPrice: updated[0] });
      } else {
        const newPrice = await db.insert(productPrices).values({ tenantId, priceListId, productId, price: price.toString() }).returning();
        return res.json({ productPrice: newPrice[0] });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Products API ---
  app.get("/api/tenants/:tenantId/categories", authAndTenant, async (req: AuthRequest, res) => {
    try {
      const { tenantId } = req.params;
      const allCategories = await db.select().from(productCategories).where(eq(productCategories.tenantId, tenantId)).orderBy(desc(productCategories.createdAt));
      res.json({ categories: allCategories });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tenants/:tenantId/categories", authAndTenant, requireRole(['superadmin', 'company_owner', 'general_manager', 'warehouse']), async (req: AuthRequest, res) => {
    try {
      const { tenantId } = req.params;
      const { name, code, parentId } = req.body;

      if (parentId) {
        const parent = await db.select().from(productCategories).where(and(eq(productCategories.tenantId, tenantId), eq(productCategories.id, parentId))).limit(1);
        if (!parent.length) return res.status(404).json({ error: 'Parent category not found' });
      }

      const newCat = await db.insert(productCategories).values({ tenantId, name, code, parentId: parentId || null }).returning();
      res.json({ category: newCat[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/tenants/:tenantId/products", authAndTenant, async (req: AuthRequest, res) => {
    try {
      const { tenantId } = req.params;
      const allProducts = await db.select().from(products).where(eq(products.tenantId, tenantId)).orderBy(desc(products.createdAt));
      res.json({ products: allProducts });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tenants/:tenantId/products", authAndTenant, requireRole(['superadmin', 'company_owner', 'general_manager', 'warehouse']), async (req: AuthRequest, res) => {
    try {
      const { tenantId } = req.params;
      const newProduct = await db.insert(products).values({
        ...req.body,
        tenantId
      }).returning();
      res.json({ product: newProduct[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Visits API ---
  app.get("/api/tenants/:tenantId/visits", authAndTenant, async (req: AuthRequest, res) => {
    try {
      const { tenantId } = req.params;
      const caller = req.dbUser;

      let baseQuery = db.select({
        visit: visits,
        customer: { name: customers.name, territory: customers.territory },
        rep: { name: users.name, territory: users.territory }
      })
      .from(visits)
      .leftJoin(customers, and(eq(visits.customerId, customers.id), eq(customers.tenantId, tenantId)))
      .leftJoin(users, and(eq(visits.repId, users.id), eq(users.tenantId, tenantId)));

      let condition = eq(visits.tenantId, tenantId);
      if (isSalesRep(caller.role)) {
        condition = and(eq(visits.tenantId, tenantId), eq(visits.repId, caller.id))!;
      } else if (isSupervisor(caller.role) && caller.territory) {
        condition = and(eq(visits.tenantId, tenantId), eq(users.territory, caller.territory))!;
      }

      const allVisits = await baseQuery.where(condition).orderBy(desc(visits.date));

      const formattedVisits = allVisits.map(row => ({
        ...row.visit,
        customerName: row.customer?.name || 'Unknown Customer',
        repName: row.rep?.name || 'Unknown Rep'
      }));
      res.json({ visits: formattedVisits });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tenants/:tenantId/visits", authAndTenant, async (req: AuthRequest, res) => {
    try {
      const { tenantId } = req.params;
      const caller = req.dbUser;
      let { customerId, repId } = req.body;

      if (isSalesRep(caller.role)) {
        repId = caller.id;
      } else if (!repId) {
        repId = caller.id;
      }

      const customer = await db.select().from(customers).where(and(eq(customers.id, customerId), eq(customers.tenantId, tenantId))).limit(1);
      if (!customer.length) return res.status(404).json({ error: "Customer not found or access denied" });
      
      if (isSalesRep(caller.role) && customer[0].repId !== caller.id) {
        return res.status(403).json({ error: "Forbidden: Customer not assigned to you" });
      }

      const rep = await db.select().from(users).where(and(eq(users.id, repId), eq(users.tenantId, tenantId))).limit(1);
      if (!rep.length) return res.status(404).json({ error: "Rep not found or access denied" });

      const newVisit = await db.insert(visits).values({
        tenantId,
        customerId,
        repId,
        status: 'In Progress',
        actualStart: new Date(),
        date: new Date()
      }).returning();
      
      res.json({ visit: newVisit[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/tenants/:tenantId/visits/:visitId", authAndTenant, async (req: AuthRequest, res) => {
    try {
      const { tenantId, visitId } = req.params;
      const caller = req.dbUser;

      const visit = await db.select().from(visits).where(and(eq(visits.tenantId, tenantId), eq(visits.id, visitId))).limit(1);
      if (!visit.length) return res.status(404).json({ error: 'Visit not found' });
      
      if (isSalesRep(caller.role) && visit[0].repId !== caller.id) {
        return res.status(403).json({ error: 'Forbidden: Visit not assigned to you' });
      }

      const customer = await db.select().from(customers).where(and(eq(customers.tenantId, tenantId), eq(customers.id, visit[0].customerId))).limit(1);
      const ordersInVisit = await db.select().from(orders).where(and(eq(orders.tenantId, tenantId), eq(orders.visitId, visitId)));
      const paymentsInVisit = await db.select().from(payments).where(and(eq(payments.tenantId, tenantId), eq(payments.visitId, visitId)));
      
      res.json({ visit: visit[0], customer: customer[0], orders: ordersInVisit, payments: paymentsInVisit });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tenants/:tenantId/visits/:visitId/checkin", authAndTenant, async (req: AuthRequest, res) => {
    try {
      const { tenantId, visitId } = req.params;
      const caller = req.dbUser;
      const { lat, lng } = req.body;

      const visit = await db.select().from(visits).where(and(eq(visits.tenantId, tenantId), eq(visits.id, visitId))).limit(1);
      if (!visit.length) return res.status(404).json({ error: 'Visit not found' });

      if (isSalesRep(caller.role) && visit[0].repId !== caller.id) {
        return res.status(403).json({ error: 'Forbidden: Visit not assigned to you' });
      }

      const updated = await db.update(visits).set({
        checkInLat: lat ? lat.toString() : null,
        checkInLng: lng ? lng.toString() : null,
      }).where(and(eq(visits.tenantId, tenantId), eq(visits.id, visitId))).returning();
      res.json({ visit: updated[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tenants/:tenantId/visits/:visitId/checkout", authAndTenant, async (req: AuthRequest, res) => {
    try {
      const { tenantId, visitId } = req.params;
      const caller = req.dbUser;
      const { lat, lng, outcome } = req.body;
      
      const visit = await db.select().from(visits).where(and(eq(visits.tenantId, tenantId), eq(visits.id, visitId))).limit(1);
      if (!visit.length) return res.status(404).json({ error: 'Visit not found' });

      if (isSalesRep(caller.role) && visit[0].repId !== caller.id) {
        return res.status(403).json({ error: 'Forbidden: Visit not assigned to you' });
      }

      if (outcome === 'ORDER CREATED' || outcome === 'ORDER + PAYMENT') {
         const hasOrder = await db.select().from(orders).where(and(eq(orders.tenantId, tenantId), eq(orders.visitId, visitId))).limit(1);
         if (!hasOrder.length) return res.status(400).json({ error: 'Cannot complete with order outcome: No order found for this visit.' });
      }
      if (outcome === 'PAYMENT COLLECTED' || outcome === 'ORDER + PAYMENT') {
         const hasPayment = await db.select().from(payments).where(and(eq(payments.tenantId, tenantId), eq(payments.visitId, visitId))).limit(1);
         if (!hasPayment.length) return res.status(400).json({ error: 'Cannot complete with payment outcome: No payment found for this visit.' });
      }

      const updated = await db.update(visits).set({
        status: 'Completed',
        outcome,
        actualEnd: new Date(),
        checkOutLat: lat ? lat.toString() : null,
        checkOutLng: lng ? lng.toString() : null,
      }).where(and(eq(visits.tenantId, tenantId), eq(visits.id, visitId))).returning();
      res.json({ visit: updated[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Orders API ---
  app.get("/api/tenants/:tenantId/orders", authAndTenant, async (req: AuthRequest, res) => {
    try {
      const { tenantId } = req.params;
      const caller = req.dbUser;

      let condition = eq(orders.tenantId, tenantId);
      if (isSalesRep(caller.role)) {
        condition = and(eq(orders.tenantId, tenantId), eq(orders.repId, caller.id))!;
      }

      const allOrders = await db.select({
        order: orders,
        customer: { name: customers.name }
      })
      .from(orders)
      .leftJoin(customers, and(eq(orders.customerId, customers.id), eq(customers.tenantId, tenantId)))
      .where(condition)
      .orderBy(desc(orders.createdAt));

      const formattedOrders = allOrders.map(row => ({
        ...row.order,
        customerName: row.customer?.name || 'Unknown Customer'
      }));

      res.json({ orders: formattedOrders });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tenants/:tenantId/orders", authAndTenant, async (req: AuthRequest, res) => {
    try {
      const { tenantId } = req.params;
      const caller = req.dbUser;
      let { customerId, repId, items, orderDiscount = 0, taxRate = 0, visitId } = req.body;

      if (isSalesRep(caller.role)) {
        repId = caller.id;
      } else if (!repId) {
        repId = caller.id;
      }

      if (!customerId || !repId || !items || !items.length) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      await db.transaction(async (tx) => {
        const customer = await tx.select().from(customers).where(and(eq(customers.tenantId, tenantId), eq(customers.id, customerId))).limit(1);
        if (!customer.length) throw new Error('Customer not found');

        if (isSalesRep(caller.role) && customer[0].repId !== caller.id) {
          throw new Error('Forbidden: Customer not assigned to you');
        }

        const rep = await tx.select().from(users).where(and(eq(users.tenantId, tenantId), eq(users.id, repId))).limit(1);
        if (!rep.length) throw new Error('Rep not found');

        if (visitId) {
          const visit = await tx.select().from(visits).where(and(eq(visits.tenantId, tenantId), eq(visits.id, visitId))).limit(1);
          if (!visit.length) throw new Error('Visit not found');
          if (isSalesRep(caller.role) && visit[0].repId !== caller.id) {
            throw new Error('Forbidden: Visit not assigned to you');
          }
        }

        const custPL = await tx.select().from(customerPriceLists).where(and(eq(customerPriceLists.tenantId, tenantId), eq(customerPriceLists.customerId, customerId))).limit(1);
        const priceListId = custPL.length > 0 ? custPL[0].priceListId : null;

        let subtotal = 0;
        const processedItems = [];

        const getDiscountLimit = (role: string) => {
          switch (role) {
            case 'superadmin':
            case 'company_owner':
            case 'general_manager': return 100;
            case 'sales_manager': return 15;
            case 'supervisor': return 10;
            case 'sales_rep': return 5;
            default: return 0;
          }
        };
        const maxDiscountPercent = getDiscountLimit(caller.role);

        for (const item of items) {
          if (item.quantity <= 0) throw new Error('Quantity must be positive');

          let unitPrice = 0;
          if (priceListId) {
            const pp = await tx.select().from(productPrices).where(and(eq(productPrices.tenantId, tenantId), eq(productPrices.productId, item.productId), eq(productPrices.priceListId, priceListId))).limit(1);
            if (pp.length > 0) unitPrice = Number(pp[0].price);
          }
          let prodTaxRate = 0;
          if (unitPrice === 0) {
             const prod = await tx.select().from(products).where(and(eq(products.tenantId, tenantId), eq(products.id, item.productId))).limit(1);
             if (!prod.length) throw new Error('Product not found: ' + item.productId);
             if (!prod[0].active) throw new Error('Product is inactive: ' + item.productId);
             unitPrice = Number(prod[0].price || 0);
             prodTaxRate = Number(prod[0].tax || 0);
          }

          const lineSubtotal = item.quantity * unitPrice;
          const lineDiscount = Number(item.discount || 0);

          if (lineSubtotal > 0 && (lineDiscount / lineSubtotal) * 100 > maxDiscountPercent) {
             throw new Error(`Discount exceeds authorized limit for role: ${caller.role}`);
          }
          const lineTax = (lineSubtotal - lineDiscount) * (Number(taxRate) || prodTaxRate || 0);
          const lineTotal = lineSubtotal - lineDiscount + lineTax;

          subtotal += lineSubtotal;

          processedItems.push({
            tenantId,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: unitPrice.toString(),
            discount: lineDiscount.toString(),
            tax: lineTax.toString(),
            lineTotal: lineTotal.toString()
          });
        }

        if (subtotal > 0 && (Number(orderDiscount) / subtotal) * 100 > maxDiscountPercent) {
          throw new Error(`Order discount exceeds authorized limit for role: ${caller.role}`);
        }
        const totalDiscount = Number(orderDiscount) + processedItems.reduce((sum, item) => sum + Number(item.discount), 0);
        const taxableAmount = subtotal - totalDiscount;
        const totalTax = taxableAmount * Number(taxRate) + processedItems.reduce((sum, item) => sum + Number(item.tax), 0);
        const grandTotal = taxableAmount + totalTax;

        const cust = customer[0];
        const creditLimit = Number(cust.creditLimit || 0);
        const currentBalance = Number(cust.balance || 0);
        if (creditLimit > 0 && (currentBalance + grandTotal > creditLimit)) {
          throw new Error('Credit limit exceeded');
        }

        const newOrder = await tx.insert(orders).values({
          tenantId,
          customerId,
          repId,
          visitId: visitId || null,
          orderNumber: `ORD-${Date.now()}`,
          subtotal: subtotal.toString(),
          discount: totalDiscount.toString(),
          tax: totalTax.toString(),
          total: grandTotal.toString(),
          status: 'Submitted'
        }).returning();

        const orderId = newOrder[0].id;

        for (const item of processedItems) {
          await tx.insert(orderItems).values({
            ...item,
            orderId
          });
        }

        res.json({ order: newOrder[0] });
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tenants/:tenantId/orders/:orderId/approve", authAndTenant, requireRole(['superadmin', 'company_owner', 'general_manager', 'sales_manager']), async (req: AuthRequest, res) => {
    try {
      const { tenantId, orderId } = req.params;
      const order = await db.select().from(orders).where(and(eq(orders.id, orderId), eq(orders.tenantId, tenantId))).limit(1);
      if (!order.length) return res.status(404).json({ error: 'Order not found' });
      
      const updated = await db.update(orders).set({ status: 'Approved' }).where(and(eq(orders.id, orderId), eq(orders.tenantId, tenantId))).returning();
      res.json({ order: updated[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tenants/:tenantId/orders/:orderId/cancel", authAndTenant, async (req: AuthRequest, res) => {
    try {
      const { tenantId, orderId } = req.params;
      const caller = req.dbUser;

      const order = await db.select().from(orders).where(and(eq(orders.id, orderId), eq(orders.tenantId, tenantId))).limit(1);
      if (!order.length) return res.status(404).json({ error: 'Order not found' });

      if (isSalesRep(caller.role) && order[0].repId !== caller.id) {
        return res.status(403).json({ error: 'Forbidden: Order not created by you' });
      }

      const updated = await db.update(orders).set({ status: 'Cancelled' }).where(and(eq(orders.id, orderId), eq(orders.tenantId, tenantId))).returning();
      res.json({ order: updated[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Dashboard API ---
  app.get("/api/tenants/:tenantId/dashboard/kpis", authAndTenant, async (req: AuthRequest, res) => {
    try {
      const { tenantId } = req.params;
      const caller = req.dbUser;

      let allOrders = await db.select().from(orders).where(eq(orders.tenantId, tenantId));
      let allCustomers = await db.select().from(customers).where(eq(customers.tenantId, tenantId));
      let allVisits = await db.select().from(visits).where(eq(visits.tenantId, tenantId));
      let allPayments = await db.select().from(payments).where(eq(payments.tenantId, tenantId));
      let allInvoices = await db.select().from(invoices).where(eq(invoices.tenantId, tenantId));

      if (isSalesRep(caller.role)) {
        allOrders = allOrders.filter(o => o.repId === caller.id);
        allCustomers = allCustomers.filter(c => c.repId === caller.id);
        allVisits = allVisits.filter(v => v.repId === caller.id);
        allPayments = allPayments.filter(p => p.repId === caller.id);
        const myCustomerIds = new Set(allCustomers.map(c => c.id));
        allInvoices = allInvoices.filter(i => myCustomerIds.has(i.customerId));
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todaysOrders = allOrders.filter(o => new Date(o.date) >= today);
      const totalRevenue = allOrders.reduce((sum, order) => sum + Number(order.total), 0);
      const todaysRevenue = todaysOrders.reduce((sum, order) => sum + Number(order.total), 0);

      const todaysPayments = allPayments.filter(p => new Date(p.date) >= today);
      const todaysCollections = todaysPayments.reduce((sum, p) => sum + Number(p.amount), 0);
      const totalCollections = allPayments.reduce((sum, p) => sum + Number(p.amount), 0);

      const outstanding = allInvoices.filter(i => i.status !== 'Cancelled').reduce((sum, i) => sum + Number(i.remaining), 0);

      const completedVisits = allVisits.filter(v => v.status === 'Completed').length;
      const plannedVisits = allVisits.length;
      const visitCompliance = plannedVisits > 0 ? (completedVisits / plannedVisits) * 100 : 0;

      res.json({
        kpis: {
          totalRevenue,
          todaysRevenue,
          totalOrders: allOrders.length,
          todaysOrders: todaysOrders.length,
          activeCustomers: allCustomers.length,
          totalVisits: allVisits.length,
          todaysCollections,
          totalCollections,
          outstanding,
          completedVisits,
          plannedVisits,
          visitCompliance
        },
        chartData: [
          { name: 'Mon', sales: 0, collections: 0 },
          { name: 'Tue', sales: 0, collections: 0 },
          { name: 'Wed', sales: 0, collections: 0 },
          { name: 'Thu', sales: 0, collections: 0 },
          { name: 'Today', sales: todaysRevenue, collections: todaysCollections },
          { name: 'Sat', sales: 0, collections: 0 },
          { name: 'Sun', sales: 0, collections: 0 }
        ]
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Invoices & Payments API ---
  app.post("/api/tenants/:tenantId/invoices", authAndTenant, async (req: AuthRequest, res) => {
    try {
      const { tenantId } = req.params;
      const { orderId } = req.body;
      const caller = req.dbUser;
      
      await db.transaction(async (tx) => {
        const order = await tx.select().from(orders).where(and(eq(orders.tenantId, tenantId), eq(orders.id, orderId))).limit(1);
        if (!order.length) throw new Error('Order not found');

        if (isSalesRep(caller.role) && order[0].repId !== caller.id) {
          throw new Error('Forbidden: Order not created by you');
        }

        if (order[0].status === 'Draft' || order[0].status === 'Cancelled') throw new Error('Invalid order status for invoicing');
        
        const existing = await tx.select().from(invoices).where(and(eq(invoices.tenantId, tenantId), eq(invoices.orderId, orderId))).limit(1);
        if (existing.length > 0) throw new Error('Invoice already exists for this order');

        const newInvoice = await tx.insert(invoices).values({
          tenantId,
          invoiceNumber: `INV-${Date.now()}`,
          orderId,
          customerId: order[0].customerId,
          subtotal: order[0].subtotal,
          discount: order[0].discount,
          tax: order[0].tax,
          total: order[0].total,
          paid: '0',
          remaining: order[0].total,
          status: 'Issued'
        }).returning();
        
        await tx.update(orders).set({ status: 'Approved' }).where(and(eq(orders.tenantId, tenantId), eq(orders.id, orderId)));
        
        const customer = await tx.select().from(customers).where(and(eq(customers.tenantId, tenantId), eq(customers.id, order[0].customerId))).limit(1);
        if (customer.length) {
          const newBalance = Number(customer[0].balance || 0) + Number(order[0].total);
          await tx.update(customers).set({ balance: newBalance.toString() }).where(and(eq(customers.tenantId, tenantId), eq(customers.id, order[0].customerId)));
        }

        res.json({ invoice: newInvoice[0] });
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/tenants/:tenantId/invoices", authAndTenant, async (req: AuthRequest, res) => {
    try {
      const { tenantId } = req.params;
      const caller = req.dbUser;

      let allInvoices = await db.select().from(invoices).where(eq(invoices.tenantId, tenantId)).orderBy(desc(invoices.date));
      if (isSalesRep(caller.role)) {
        const myCustomers = await db.select({ id: customers.id }).from(customers).where(and(eq(customers.tenantId, tenantId), eq(customers.repId, caller.id)));
        const myCustIds = new Set(myCustomers.map(c => c.id));
        allInvoices = allInvoices.filter(i => myCustIds.has(i.customerId));
      }
      res.json({ invoices: allInvoices });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tenants/:tenantId/payments", authAndTenant, async (req: AuthRequest, res) => {
    try {
      const { tenantId } = req.params;
      const caller = req.dbUser;
      let { invoiceId, amount, paymentMethod, repId, visitId } = req.body;
      
      if (isSalesRep(caller.role)) {
        repId = caller.id;
      } else if (!repId) {
        repId = caller.id;
      }

      if (Number(amount) <= 0) {
        return res.status(400).json({ error: 'Payment amount must be greater than zero' });
      }

      await db.transaction(async (tx) => {
        const invoice = await tx.select().from(invoices).where(and(eq(invoices.tenantId, tenantId), eq(invoices.id, invoiceId))).limit(1);
        if (!invoice.length) throw new Error('Invoice not found');
        
        const customer = await tx.select().from(customers).where(and(eq(customers.tenantId, tenantId), eq(customers.id, invoice[0].customerId))).limit(1);
        if (!customer.length) throw new Error('Customer not found');

        if (isSalesRep(caller.role) && customer[0].repId !== caller.id) {
          throw new Error('Forbidden: Customer not assigned to you');
        }

        if (visitId) {
          const visit = await tx.select().from(visits).where(and(eq(visits.tenantId, tenantId), eq(visits.id, visitId))).limit(1);
          if (!visit.length) throw new Error('Visit not found');
          if (isSalesRep(caller.role) && visit[0].repId !== caller.id) {
            throw new Error('Forbidden: Visit not assigned to you');
          }
        }

        if (Number(amount) > Number(invoice[0].remaining)) {
          throw new Error('Payment exceeds remaining balance');
        }
        
        const newPayment = await tx.insert(payments).values({
          tenantId,
          customerId: invoice[0].customerId,
          invoiceId,
          repId,
          amount: amount.toString(),
          paymentMethod,
          visitId: visitId || null
        }).returning();
        
        const newPaid = Number(invoice[0].paid) + Number(amount);
        const newRemaining = Number(invoice[0].remaining) - Number(amount);
        const newStatus = newRemaining <= 0 ? 'Paid' : 'Partially Paid';
        
        await tx.update(invoices).set({
          paid: newPaid.toString(),
          remaining: newRemaining.toString(),
          status: newStatus
        }).where(and(eq(invoices.tenantId, tenantId), eq(invoices.id, invoiceId)));
        
        const newBalance = Number(customer[0].balance || 0) - Number(amount);
        await tx.update(customers).set({ balance: newBalance.toString() }).where(and(eq(customers.tenantId, tenantId), eq(customers.id, invoice[0].customerId)));

        res.json({ payment: newPayment[0] });
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/tenants/:tenantId/payments", authAndTenant, async (req: AuthRequest, res) => {
    try {
      const { tenantId } = req.params;
      const caller = req.dbUser;

      let allPayments = await db.select().from(payments).where(eq(payments.tenantId, tenantId)).orderBy(desc(payments.date));
      if (isSalesRep(caller.role)) {
        allPayments = allPayments.filter(p => p.repId === caller.id);
      }
      res.json({ payments: allPayments });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Returns API ---
  app.post("/api/tenants/:tenantId/returns", authAndTenant, async (req: AuthRequest, res) => {
    try {
      const { tenantId } = req.params;
      const caller = req.dbUser;
      let { customerId, repId, visitId, notes, items } = req.body;

      if (isSalesRep(caller.role)) {
        repId = caller.id;
      } else if (!repId) {
        repId = caller.id;
      }

      if (!customerId || !repId || !items || !items.length) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      await db.transaction(async (tx) => {
        const customer = await tx.select().from(customers).where(and(eq(customers.tenantId, tenantId), eq(customers.id, customerId))).limit(1);
        if (!customer.length) throw new Error('Customer not found');

        if (isSalesRep(caller.role) && customer[0].repId !== caller.id) {
          throw new Error('Forbidden: Customer not assigned to you');
        }

        if (visitId) {
          const visit = await tx.select().from(visits).where(and(eq(visits.tenantId, tenantId), eq(visits.id, visitId))).limit(1);
          if (!visit.length) throw new Error('Visit not found');
          if (isSalesRep(caller.role) && visit[0].repId !== caller.id) {
            throw new Error('Forbidden: Visit not assigned to you');
          }
        }

        const newReturn = await tx.insert(returns).values({
          tenantId,
          customerId,
          repId,
          visitId: visitId || null,
          notes,
          status: 'Pending Approval',
          date: new Date()
        }).returning();

        for (const item of items) {
          if (item.quantity <= 0) throw new Error('Quantity must be positive');
          const prod = await tx.select().from(products).where(and(eq(products.tenantId, tenantId), eq(products.id, item.productId))).limit(1);
          if (!prod.length) throw new Error('Product not found: ' + item.productId);

          const purchasedRows = await tx.execute(`
             SELECT COALESCE(SUM(oi.quantity), 0) as total
             FROM order_items oi
             JOIN orders o ON o.id = oi.order_id
             WHERE o.customer_id = '${customerId}' AND oi.product_id = '${item.productId}' AND o.tenant_id = '${tenantId}'
          `);
          const totalPurchased = Number(purchasedRows.rows?.[0]?.total || 0);

          const returnedRows = await tx.execute(`
             SELECT COALESCE(SUM(ri.quantity), 0) as total
             FROM return_items ri
             JOIN returns r ON r.id = ri.return_id
             WHERE r.customer_id = '${customerId}' AND ri.product_id = '${item.productId}' AND r.tenant_id = '${tenantId}'
          `);
          const totalReturned = Number(returnedRows.rows?.[0]?.total || 0);

          if (totalReturned + item.quantity > totalPurchased) {
             throw new Error('Return quantity exceeds total purchased quantity for product: ' + item.productId);
          }

          await tx.insert(returnItems).values({
            tenantId,
            returnId: newReturn[0].id,
            productId: item.productId,
            quantity: item.quantity,
            reason: item.reason || 'Customer Request',
            batch: item.batch || null,
            notes: item.notes || null
          });
        }
        res.json({ return: newReturn[0] });
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tenants/:tenantId/returns/:returnId/approve", authAndTenant, requireRole(['superadmin', 'company_owner', 'general_manager', 'warehouse']), async (req: AuthRequest, res) => {
    try {
      const { tenantId, returnId } = req.params;
      const updated = await db.update(returns).set({ status: 'Approved' }).where(and(eq(returns.tenantId, tenantId), eq(returns.id, returnId))).returning();
      if (!updated.length) return res.status(404).json({ error: 'Return not found' });
      res.json({ return: updated[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/tenants/:tenantId/returns", authAndTenant, async (req: AuthRequest, res) => {
    try {
      const { tenantId } = req.params;
      const caller = req.dbUser;

      let allReturns = await db.select().from(returns).where(eq(returns.tenantId, tenantId)).orderBy(desc(returns.date));
      if (isSalesRep(caller.role)) {
        allReturns = allReturns.filter(r => r.repId === caller.id);
      }
      res.json({ returns: allReturns });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Timeline API ---
  app.get("/api/tenants/:tenantId/timeline", authAndTenant, async (req: AuthRequest, res) => {
    try {
      const { tenantId } = req.params;
      const caller = req.dbUser;
      
      let visitCondition = eq(visits.tenantId, tenantId);
      let orderCondition = eq(orders.tenantId, tenantId);
      let paymentCondition = eq(payments.tenantId, tenantId);

      if (isSalesRep(caller.role)) {
        visitCondition = and(eq(visits.tenantId, tenantId), eq(visits.repId, caller.id))!;
        orderCondition = and(eq(orders.tenantId, tenantId), eq(orders.repId, caller.id))!;
        paymentCondition = and(eq(payments.tenantId, tenantId), eq(payments.repId, caller.id))!;
      }

      const allVisits = await db.select({ visit: visits, customer: { name: customers.name }, rep: { name: users.name }})
        .from(visits)
        .leftJoin(customers, and(eq(visits.customerId, customers.id), eq(customers.tenantId, tenantId)))
        .leftJoin(users, and(eq(visits.repId, users.id), eq(users.tenantId, tenantId)))
        .where(visitCondition).limit(20);
        
      const allOrders = await db.select({ order: orders, customer: { name: customers.name }, rep: { name: users.name }})
        .from(orders)
        .leftJoin(customers, and(eq(orders.customerId, customers.id), eq(customers.tenantId, tenantId)))
        .leftJoin(users, and(eq(orders.repId, users.id), eq(users.tenantId, tenantId)))
        .where(orderCondition).limit(20);
        
      const allPayments = await db.select({ payment: payments, customer: { name: customers.name }, rep: { name: users.name }})
        .from(payments)
        .leftJoin(customers, and(eq(payments.customerId, customers.id), eq(customers.tenantId, tenantId)))
        .leftJoin(users, and(eq(payments.repId, users.id), eq(users.tenantId, tenantId)))
        .where(paymentCondition).limit(20);

      const events: any[] = [];
      
      allVisits.forEach(v => {
         if (v.visit.actualStart) {
            events.push({ id: 'v_in_'+v.visit.id, type: 'check_in', time: v.visit.actualStart, rep: v.rep?.name, customer: v.customer?.name, details: '' });
         }
         if (v.visit.actualEnd) {
            events.push({ id: 'v_out_'+v.visit.id, type: 'check_out', time: v.visit.actualEnd, rep: v.rep?.name, customer: v.customer?.name, details: 'Outcome: ' + v.visit.outcome });
         }
      });
      
      allOrders.forEach(o => {
         events.push({ id: 'o_'+o.order.id, type: 'order', time: o.order.createdAt, rep: o.rep?.name, customer: o.customer?.name, details: `Order ${o.order.orderNumber} created (${Number(o.order.total).toFixed(2)} JOD)` });
      });
      
      allPayments.forEach(p => {
         events.push({ id: 'p_'+p.payment.id, type: 'payment', time: p.payment.createdAt, rep: p.rep?.name, customer: p.customer?.name, details: `Payment collected (${Number(p.payment.amount).toFixed(2)} JOD)` });
      });
      
      events.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

      res.json({ timeline: events.slice(0, 50) });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- AI Route Planner ---
  app.post("/api/ai/journey-plan", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { rep, customers, startingLocation } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `
You are an expert AI Route Optimizer for a field sales SaaS platform. 
A sales representative named ${rep.name} is starting their day at: ${startingLocation}.
They need to visit the following customers today:
${JSON.stringify(customers, null, 2)}

Create an optimal daily itinerary (journey plan) for them. Consider logical geographic routing and typical business hours (9 AM - 5 PM).

Return the result as a strict JSON array of objects, with NO markdown formatting, just the raw JSON. Each object should have the following format:
{
  "time": "HH:MM AM/PM",
  "action": "Drive / Visit / Break",
  "customerName": "Name of customer (if applicable)",
  "location": "Address or location",
  "notes": "Brief tips or reasoning"
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      const text = response.text || "[]";
      const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      
      try {
        const schedule = JSON.parse(cleanedText);
        res.json({ schedule });
      } catch (parseError) {
        console.error("Failed to parse JSON from AI:", cleanedText);
        res.status(500).json({ error: "Failed to parse AI response into valid JSON." });
      }

    } catch (error) {
      console.error("Error generating journey plan:", error);
      res.status(500).json({ error: "Internal server error during journey planning." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (process.argv[1] && process.argv[1].endsWith('server.ts')) {
  startServer();
}
