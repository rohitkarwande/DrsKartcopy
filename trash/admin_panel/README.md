# Admin Panel Archive (Quarantine / Trash)

This directory contains the archived code for the **DKart Administration Panel** (both Backend and Frontend). 
These files have been disconnected from the live application so they cannot be accessed, hit by live traffic, or bundled into production.

---

## Directory Structure

```text
trash/admin_panel/
├── backend/
│   ├── archived_admin_functions/
│   │   ├── adminSupportAndPlatformFunctions.js # Admin functions for tickets, services, legal, funnel, flags, audit
│   │   ├── adminMarketingFunctions.js          # Admin functions for hero banners and promotion approvals
│   │   ├── adminEmailNotificationService.js    # Admin email dispatcher (emailAdmins)
│   │   ├── kycNotificationService.js           # Admin KYC submission notification
│   │   └── equipmentNotificationService.js     # Admin new listing notification
│   ├── controllers/
│   │   ├── adminController.js         # Admin platform management & statistics
│   │   └── adminAuthController.js     # Admin 2FA dual verification endpoints
│   ├── routes/
│   │   ├── adminRoutes.js             # /api/admin routes
│   │   └── adminAuthRoutes.js         # /api/admin/auth routes
│   └── services/
│       ├── adminService.js            # Core admin queries & aggregation logic
│       └── adminAuthService.js        # Admin 2FA dual OTP service
└── frontend/
    ├── components/
    │   ├── AdminProtectedRoute.tsx   # React Router route guard for admin privileges
    │   └── AdminNotifications.tsx     # Admin bell notification popup
    ├── hooks/
    │   └── useAdminKyc.ts             # Admin query hooks for KYC, users & system stats
    └── pages/
        └── admin/                     # All admin dashboard views:
            ├── AdminLayout.tsx
            ├── AdminOverview.tsx
            ├── AdminUsers.tsx
            ├── AdminSecurity.tsx
            ├── HeroBanners.tsx
            ├── AdminPromotions.tsx
            ├── KycApplications.tsx
            ├── DealFunnel.tsx
            ├── AdminTickets.tsx
            ├── AdminReports.tsx
            ├── AdminServices.tsx
            └── AdminSecretPortal.tsx
```

---

## Restoration Notes
If the admin panel ever needs to be restored:
1. Move the frontend files back to `frontend/src/` (`pages/admin`, `components/auth/AdminProtectedRoute.tsx`, `components/layout/AdminNotifications.tsx`, `hooks/useAdminKyc.ts`).
2. Move the backend files back to their respective directories (`controllers/`, `routes/`, `services/`).
3. Re-mount `/admin/auth` and `/admin` in `routes/appRoutes.js` and in `frontend/src/routes/AppRoutes.tsx`.
