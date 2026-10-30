import { Routes, Route, Navigate } from "react-router-dom";

// Layouts & Protection Guards
import { MainLayout } from "../components/layout/MainLayout";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { SellerProtectedRoute } from "../components/auth/SellerProtectedRoute";

// Marketplace Pages
import { Home } from "../pages/marketplace/Home";
import { About } from "../pages/marketplace/About";
import { Search } from "../pages/marketplace/Search";
import { EquipmentDetails } from "../pages/marketplace/EquipmentDetails";
import { Contact } from "../pages/marketplace/Contact";
import { PrivacyPolicy } from "../pages/marketplace/PrivacyPolicy";
import { TermsOfService } from "../pages/marketplace/TermsOfService";

// Auth Pages
import { AuthPage } from "../pages/auth/AuthPage";
import { KycVerification } from "../pages/auth/KycVerification";

// Dashboard Pages
import { DashboardOverview } from "../pages/dashboard/Overview";
import { Listings } from "../pages/dashboard/Listings";
import { Inquiries } from "../pages/dashboard/Inquiries";
import { Chat } from "../pages/dashboard/Chat";
import { Profile } from "../pages/dashboard/Profile";
import { Promotions } from "../pages/dashboard/Promotions";
import { SupportTickets } from "../pages/dashboard/SupportTickets";
import { ServiceBooking } from "../pages/dashboard/ServiceBooking";
import { SellEquipment } from "../pages/dashboard/SellEquipment";

/**
 * AppRoutes Component
 * Centralizes all frontend routing rules, page mappings, and security boundaries
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* ── MAIN LAYOUT ROUTES (TopNavbar + Footer) ── */}
      <Route element={<MainLayout />}>
        {/* Marketplace Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/equipment/:id" element={<EquipmentDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/kyc" element={<KycVerification />} />

        {/* User Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="listings" element={<Listings />} />
          <Route path="inquiries" element={<Inquiries />} />
          <Route path="profile" element={<Profile />} />
          <Route path="chat" element={<Chat />} />
          <Route path="promotions" element={<Promotions />} />
          <Route path="tickets" element={<SupportTickets />} />
          <Route path="services" element={<ServiceBooking />} />
        </Route>

        {/* Seller-Only Routes (gated by KYC/role) */}
        <Route element={<SellerProtectedRoute />}>
          <Route path="/sell" element={<SellEquipment />} />
          <Route path="/edit/:id" element={<SellEquipment />} />
        </Route>
      </Route>

      {/* Fallback catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
