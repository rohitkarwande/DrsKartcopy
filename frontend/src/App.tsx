import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CheckCircle2, XCircle } from "lucide-react";
import { ThemeProvider } from "./context/ThemeContext";
import { useRoleSync } from "./hooks/useAuth";
import { AppRoutes } from "./routes/AppRoutes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      retry: 1,
    },
  },
});

/**
 * Mounts the real-time role sync socket listener globally.
 * Triggers a custom event when the admin updates or reviews KYC/role status.
 */
function RoleSyncMount() {
  useRoleSync((data) => {
    if (data.role === "seller") {
      const msg = data.message || "🎉 Your Seller account has been approved!";
      window.dispatchEvent(
        new CustomEvent("role-update-toast", {
          detail: { message: msg, type: "success" },
        })
      );
    } else if (data.kycStatus === "Rejected") {
      window.dispatchEvent(
        new CustomEvent("role-update-toast", {
          detail: { message: data.message, type: "error" },
        })
      );
    }
  });
  return null;
}

/**
 * Global in-page toast notification listener for account and role status updates
 */
function ToastListener() {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setToast(detail);
      setTimeout(() => setToast(null), 6000);
    };
    window.addEventListener("role-update-toast", handler);
    return () => window.removeEventListener("role-update-toast", handler);
  }, []);

  if (!toast) return null;

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] flex items-start gap-3 max-w-sm p-4 rounded-2xl shadow-2xl border text-white animate-in slide-in-from-top-2 duration-300 ${
        toast.type === "success"
          ? "bg-emerald-800 border-emerald-600"
          : "bg-red-900 border-red-700"
      }`}
    >
      {toast.type === "success" ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-300 shrink-0 mt-0.5" />
      ) : (
        <XCircle className="h-5 w-5 text-red-300 shrink-0 mt-0.5" />
      )}
      <p className="text-sm font-medium leading-snug">{toast.message}</p>
    </div>
  );
}

/**
 * Root Application Component
 * Initializes context providers and renders the centralized AppRoutes tree
 */
function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="drskart-theme">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <RoleSyncMount />
          <ToastListener />
          <AppRoutes />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
