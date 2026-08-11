import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { RepLayout } from './components/RepLayout';
import { RepDashboard } from './pages/RepDashboard';
import { SuperAdmin } from './pages/SuperAdmin';
import { CompanyDashboard } from './pages/CompanyDashboard';
import { SalesTeam } from './pages/SalesTeam';
import { Customers } from './pages/Customers';
import { CustomerProfile } from './pages/CustomerProfile';
import { AIJourney } from './pages/AIJourney';
import { Products } from './pages/Products';
import { Orders } from './pages/Orders';
import { Visits } from './pages/Visits';
import { ActiveVisit } from './pages/ActiveVisit';
import { BiDashboards } from './pages/BiDashboards';
import { Timeline } from './pages/Timeline';
import { Reports } from './pages/Reports';
import { Managers } from './pages/Managers';
import { Forms } from './pages/Forms';
import { ProductCategories } from './pages/ProductCategories';
import { Reminders } from './pages/Reminders';
import { Media } from './pages/Media';
import { ScheduleCalendar } from './pages/ScheduleCalendar';
import { ScheduleRoutes } from './pages/ScheduleRoutes';
import { ScheduleRules } from './pages/ScheduleRules';
import { SchedulePlans } from './pages/SchedulePlans';
import { SalesOrders } from './pages/SalesOrders';
import { Invoices } from './pages/Invoices';
import { Payments } from './pages/Payments';
import { SalesAnalytics } from './pages/SalesAnalytics';
import { Warehouses } from './pages/Warehouses';
import { StockMovements } from './pages/StockMovements';
import { Promotions } from './pages/Promotions';
import { SaleReturns } from './pages/SaleReturns';
import { Jobs } from './pages/Jobs';
import { AreaTags } from './pages/AreaTags';
import { ClientTags } from './pages/ClientTags';
import { FeedbackOptions } from './pages/FeedbackOptions';
import { ClientChannels } from './pages/ClientChannels';
import { ClientChains } from './pages/ClientChains';
import { Teams } from './pages/Teams';
import { Gallery } from './pages/Gallery';
import { LiveMap } from './pages/LiveMap';

function AppRoutes() {
  const location = useLocation();
  const isRepApp = location.pathname.startsWith('/rep');

  if (isRepApp) {
    return (
      <RepLayout>
        <Routes>
          <Route path="/rep" element={<RepDashboard />} />
        </Routes>
      </RepLayout>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<SuperAdmin />} />
        <Route path="/company/:companyId" element={<CompanyDashboard />} />
        <Route path="/company/:companyId/team" element={<SalesTeam />} />
        <Route path="/company/:companyId/customers" element={<Customers />} />
        <Route path="/company/:companyId/customers/:customerId" element={<CustomerProfile />} />
        <Route path="/company/:companyId/products" element={<Products />} />
        <Route path="/company/:companyId/orders" element={<Orders />} />
        <Route path="/company/:companyId/visits" element={<Visits />} />
        <Route path="/company/:companyId/visits/:visitId" element={<ActiveVisit />} />
        <Route path="/company/:companyId/ai-journey" element={<AIJourney />} />
        <Route path="/company/:companyId/bi-dashboards" element={<BiDashboards />} />
        <Route path="/company/:companyId/timeline" element={<Timeline />} />
        <Route path="/company/:companyId/reports" element={<Reports />} />
        <Route path="/company/:companyId/managers" element={<Managers />} />
        <Route path="/company/:companyId/forms" element={<Forms />} />
        <Route path="/company/:companyId/product-categories" element={<ProductCategories />} />
        <Route path="/company/:companyId/reminders" element={<Reminders />} />
        <Route path="/company/:companyId/media" element={<Media />} />
        <Route path="/company/:companyId/schedule/calendar" element={<ScheduleCalendar />} />
        <Route path="/company/:companyId/schedule/routes" element={<ScheduleRoutes />} />
        <Route path="/company/:companyId/schedule/rules" element={<ScheduleRules />} />
        <Route path="/company/:companyId/schedule/plans" element={<SchedulePlans />} />
        <Route path="/company/:companyId/sales/orders" element={<SalesOrders />} />
        <Route path="/company/:companyId/sales/invoices" element={<Invoices />} />
        <Route path="/company/:companyId/sales/payments" element={<Payments />} />
        <Route path="/company/:companyId/sales/analytics" element={<SalesAnalytics />} />
        <Route path="/company/:companyId/sales/warehouses" element={<Warehouses />} />
        <Route path="/company/:companyId/sales/stock-movements" element={<StockMovements />} />
        <Route path="/company/:companyId/sales/promotions" element={<Promotions />} />
        <Route path="/company/:companyId/sales/returns" element={<SaleReturns />} />
        <Route path="/company/:companyId/jobs" element={<Jobs />} />
        <Route path="/company/:companyId/settings/area-tags" element={<AreaTags />} />
        <Route path="/company/:companyId/settings/client-tags" element={<ClientTags />} />
        <Route path="/company/:companyId/settings/feedback-options" element={<FeedbackOptions />} />
        <Route path="/company/:companyId/settings/client-channels" element={<ClientChannels />} />
        <Route path="/company/:companyId/settings/client-chains" element={<ClientChains />} />
        <Route path="/company/:companyId/settings/teams" element={<Teams />} />
        <Route path="/company/:companyId/settings/gallery" element={<Gallery />} />
        <Route path="/company/:companyId/map" element={<LiveMap />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
