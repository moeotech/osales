import { pgTable, text, timestamp, decimal, integer, uuid, boolean, jsonb } from "drizzle-orm/pg-core";

// Tenants (Companies)
export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  subscriptionPlan: text("subscription_plan").default('Starter'),
  status: text("status").default('active'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Users & Roles
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: text("uid").unique(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(), // 'superadmin', 'company_owner', 'general_manager', 'sales_director', 'sales_manager', 'supervisor', 'sales_rep', 'merchandiser', 'accountant', 'warehouse'
  status: text("status").default('active'), // 'Working', 'On Break', 'On Visit', 'Offline', 'active'
  territory: text("territory"),
  currentLocation: text("current_location"),
  monthlyTarget: decimal("monthly_target", { precision: 10, scale: 2 }).default('0'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Customers
export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  customerCode: text("customer_code"),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'Supermarket', 'Pharmacy', 'Wholesale', 'Retail'
  contactPerson: text("contact_person"),
  email: text("email"),
  phone: text("phone"),
  location: text("location"),
  address: text("address"),
  locationLat: decimal("location_lat", { precision: 10, scale: 7 }),
  locationLng: decimal("location_lng", { precision: 10, scale: 7 }),
  territory: text("territory"),
  area: text("area"),
  repId: uuid("rep_id").references(() => users.id),
  status: text("status").default('active'), // active, inactive, lead
  balance: decimal("balance", { precision: 10, scale: 2 }).default('0'),
  creditLimit: decimal("credit_limit", { precision: 10, scale: 2 }).default('0'),
  lastVisit: timestamp("last_visit"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Price Lists
export const priceLists = pgTable("price_lists", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  name: text("name").notNull(), // Retail, Wholesale, VIP
  currency: text("currency").default('JOD'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const customerPriceLists = pgTable("customer_price_lists", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  priceListId: uuid("price_list_id").references(() => priceLists.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Products
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  sku: text("sku"),
  barcode: text("barcode").notNull().default(''),
  name: text("name").notNull(),
  arabicName: text("arabic_name"),
  localName: text("local_name").notNull().default(''),
  category: text("category").notNull().default(''),
  categoryId: uuid("category_id"),
  subCategoryId: uuid("sub_category_id"),
  brand: text("brand"),
  description: text("description"),
  localDescription: text("local_description"),
  unit: text("unit").default('PCS'),
  packSize: integer("pack_size").default(1),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Default price
  taxType: text("tax_type"),
  tax: decimal("tax", { precision: 5, scale: 2 }).default('0'),
  rsl: integer("rsl").default(0),
  stock: integer("stock").default(0),
  media: jsonb("media").default('[]'),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productPrices = pgTable("product_prices", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  priceListId: uuid("price_list_id").references(() => priceLists.id).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Orders
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  orderNumber: text("order_number").notNull().default('ORD-000'),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  repId: uuid("rep_id").references(() => users.id).notNull(),
  date: timestamp("date").defaultNow().notNull(),
  currency: text("currency").default('JOD'),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull().default('0'),
  discount: decimal("discount", { precision: 10, scale: 2 }).default('0'),
  tax: decimal("tax", { precision: 10, scale: 2 }).default('0'),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default('Draft'), // Draft, Submitted, Pending Approval, Approved, Delivered, Cancelled
  visitId: uuid("visit_id").references(() => visits.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  orderId: uuid("order_id").references(() => orders.id).notNull(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).default('0'),
  tax: decimal("tax", { precision: 10, scale: 2 }).default('0'),
  lineTotal: decimal("line_total", { precision: 10, scale: 2 }).notNull(),
});

// Invoices
export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  invoiceNumber: text("invoice_number").notNull(),
  orderId: uuid("order_id").references(() => orders.id),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  date: timestamp("date").defaultNow().notNull(),
  dueDate: timestamp("due_date"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).default('0'),
  tax: decimal("tax", { precision: 10, scale: 2 }).default('0'),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  paid: decimal("paid", { precision: 10, scale: 2 }).default('0'),
  remaining: decimal("remaining", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default('Issued'), // Issued, Partially Paid, Paid, Overdue, Cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Payments & Collections
export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  invoiceId: uuid("invoice_id").references(() => invoices.id),
  repId: uuid("rep_id").references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(), // Cash, Bank Transfer, Card, Cheque
  date: timestamp("date").defaultNow().notNull(),
  reference: text("reference"),
  visitId: uuid("visit_id").references(() => visits.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Returns
export const returns = pgTable("returns", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  repId: uuid("rep_id").references(() => users.id).notNull(),
  date: timestamp("date").defaultNow().notNull(),
  status: text("status").default('Pending Approval'), // Pending Approval, Approved, Rejected
  visitId: uuid("visit_id").references(() => visits.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const returnItems = pgTable("return_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  returnId: uuid("return_id").references(() => returns.id).notNull(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  reason: text("reason").notNull(), // Damaged, Expired, Wrong Product, Customer Request
  batch: text("batch"),
  notes: text("notes"),
});

// Visits
export const visits = pgTable("visits", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  repId: uuid("rep_id").references(() => users.id).notNull(),
  date: timestamp("date").notNull().defaultNow(),
  plannedStart: timestamp("planned_start"),
  actualStart: timestamp("actual_start"),
  actualEnd: timestamp("actual_end"),
  checkInLat: decimal("check_in_lat", { precision: 10, scale: 7 }),
  checkInLng: decimal("check_in_lng", { precision: 10, scale: 7 }),
  checkOutLat: decimal("check_out_lat", { precision: 10, scale: 7 }),
  checkOutLng: decimal("check_out_lng", { precision: 10, scale: 7 }),
  distanceFromCustomer: decimal("distance_from_customer", { precision: 10, scale: 2 }), // in meters
  visitType: text("visit_type"),
  status: text("status").default('Planned'), // Planned, Pending, In Progress, Completed, Missed, Cancelled
  outcome: text("outcome"), // Order Created, Payment Collected, No Order, Follow-up Required, etc.
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Audit Logs

export const visitNotes = pgTable("visit_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  visitId: uuid("visit_id").references(() => visits.id).notNull(),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  repId: uuid("rep_id").references(() => users.id).notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const visitPhotos = pgTable("visit_photos", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  visitId: uuid("visit_id").references(() => visits.id).notNull(),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  repId: uuid("rep_id").references(() => users.id).notNull(),
  photoUrl: text("photo_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const visitForms = pgTable("visit_forms", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  visitId: uuid("visit_id").references(() => visits.id).notNull(),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  repId: uuid("rep_id").references(() => users.id).notNull(),
  formData: jsonb("form_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  action: text("action").notNull(), // Create, Update, Delete, CheckIn, Checkout
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  oldValue: jsonb("old_value"),
  newValue: jsonb("new_value"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productCategories = pgTable("product_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  name: text("name").notNull(),
  code: text("code"),
  parentId: uuid("parent_id"),
  status: text("status").default('active'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
