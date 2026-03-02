import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { MainLayout } from "./components/layout/MainLayout";

// Main Pages
import Dashboard from "./pages/Dashboard";
import DeviceList from "./pages/DeviceList";
import DeviceDetail from "./pages/DeviceDetail";
import AlertMonitor from "./pages/AlertMonitor";
import AlertDetail from "./pages/AlertDetail";
import TicketList from "./pages/TicketList";
import TicketDetail from "./pages/TicketDetail";
import WorkOrderList from "./pages/WorkOrderList";
import WorkOrderDetail from "./pages/WorkOrderDetail";
import ReleaseList from "./pages/ReleaseList";
import ReleaseDetail from "./pages/ReleaseDetail";
import ConnectionHub from "./pages/ConnectionHub";
import ConnectionDetail from "./pages/ConnectionDetail";
import TemplateList from "./pages/TemplateList";
import TemplateDetail from "./pages/TemplateDetail";
import Reports from "./pages/Reports";
import AdminDashboard from "./pages/AdminDashboard";
import SiteDetail from "./pages/SiteDetail";

// User Pages
import Profile from "./pages/Profile";
import SettingsPage from "./pages/SettingsPage";
import Notifications from "./pages/Notifications";

// Auth Pages
import Auth from "./pages/Auth";

// Customer Pages
import CustomerDashboard from "./pages/CustomerDashboard";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Route (no layout) */}
            <Route path="/auth" element={<Auth />} />
            
            <Route element={<MainLayout />}>
              {/* Main Routes */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/devices" element={<DeviceList />} />
              <Route path="/devices/:id" element={<DeviceDetail />} />
              <Route path="/alerts" element={<AlertMonitor />} />
              <Route path="/alerts/:id" element={<AlertDetail />} />
              <Route path="/tickets" element={<TicketList />} />
              <Route path="/tickets/:id" element={<TicketDetail />} />
              <Route path="/work-orders" element={<WorkOrderList />} />
              <Route path="/work-orders/:id" element={<WorkOrderDetail />} />
              <Route path="/releases" element={<ReleaseList />} />
              <Route path="/releases/:id" element={<ReleaseDetail />} />
              <Route path="/connections" element={<ConnectionHub />} />
              <Route path="/connections/:id" element={<ConnectionDetail />} />
              <Route path="/templates" element={<TemplateList />} />
              <Route path="/templates/:id" element={<TemplateDetail />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/sites/:id" element={<SiteDetail />} />
              
              {/* User Routes */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/notifications" element={<Notifications />} />
              
              {/* Customer Routes */}
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
              <Route path="/customer/devices" element={<DeviceList />} />
              <Route path="/customer/tickets" element={<TicketList />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
