export type Company = {
  id: string;
  name: string;
  industry: string;
  createdAt: string;
  status: 'active' | 'inactive';
  subscriptionPlan: 'Starter' | 'Business' | 'Enterprise';
  usersCount: number;
};

export type Customer = {
  id: string;
  companyId: string;
  name: string;
  type: 'Supermarket' | 'Pharmacy' | 'Wholesale' | 'Retail';
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  territory: string;
  status: 'lead' | 'active' | 'churned';
  balance: number;
  lastVisit?: string;
};

export type SalesRep = {
  id: string;
  companyId: string;
  name: string;
  email: string;
  role: 'sales_rep' | 'supervisor' | 'manager';
  territory: string;
  status: 'Working' | 'On Break' | 'On Visit' | 'Offline';
  currentLocation?: string;
  kpis: {
    monthlyTarget: number;
    currentSales: number;
    meetingsCompleted: number;
  };
};

export type Product = {
  id: string;
  companyId: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
};

export type Order = {
  id: string;
  companyId: string;
  customerId: string;
  repId: string;
  date: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
};

export type Visit = {
  id: string;
  companyId: string;
  customerId: string;
  repId: string;
  date: string;
  status: 'planned' | 'completed' | 'missed';
  notes?: string;
};

export type JourneyStop = {
  time: string;
  action: string;
  customerName?: string;
  location: string;
  notes: string;
};
