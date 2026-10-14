import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { WalletProvider } from "@/contexts/WalletContext";
import { AppDataProvider } from "@/contexts/AppDataContext";
import { Loader2 } from "lucide-react";

/* ===================== PAGES ===================== */

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SelectRole from "./pages/SelectRole";
import Dashboard from "./pages/Dashboard";
import CustomerHome from "./pages/CustomerHome";
import MessDetails from "./pages/MessDetails";
import WalletPage from "./pages/Wallet";
import OrdersPage from "./pages/Orders";
import AIAssistant from "./pages/AIAssistant";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import MenuManagement from "./pages/MenuManagement";
import Community from "./pages/Community";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/* ===================== LOADING ===================== */

const LoadingScreen = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

/* ===================== ROUTE GUARDS ===================== */

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/" replace />;

  return <>{children}</>;
};

const RoleRoute = ({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: "customer" | "mess_manager";
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!user?.role) return <Navigate to="/select-role" replace />;

  if (requiredRole && user.role !== requiredRole) {
    return (
      <Navigate
        to={user.role === "mess_manager" ? "/dashboard" : "/home"}
        replace
      />
    );
  }

  return <>{children}</>;
};

/* 🔥 FIXED PUBLIC ROUTE */
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (isAuthenticated) return <Navigate to="/select-role" replace />;

  return <>{children}</>;
};

/* ===================== ROUTES ===================== */

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<PublicRoute><Welcome /></PublicRoute>} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

    {/* Role selection */}
    <Route
      path="/select-role"
      element={
        <ProtectedRoute>
          <SelectRole />
        </ProtectedRoute>
      }
    />

    {/* Manager */}
    <Route path="/dashboard" element={<RoleRoute requiredRole="mess_manager"><Dashboard /></RoleRoute>} />
    <Route path="/analytics" element={<RoleRoute requiredRole="mess_manager"><Analytics /></RoleRoute>} />
    <Route path="/menu" element={<RoleRoute requiredRole="mess_manager"><MenuManagement /></RoleRoute>} />
    <Route path="/community" element={<RoleRoute requiredRole="mess_manager"><Community /></RoleRoute>} />
    <Route path="/settings" element={<RoleRoute requiredRole="mess_manager"><Settings /></RoleRoute>} />

    {/* Customer */}
    <Route path="/home" element={<RoleRoute requiredRole="customer"><CustomerHome /></RoleRoute>} />
    <Route path="/mess/:id" element={<RoleRoute requiredRole="customer"><MessDetails /></RoleRoute>} />
    <Route path="/assistant" element={<RoleRoute requiredRole="customer"><AIAssistant /></RoleRoute>} />
    <Route path="/profile" element={<RoleRoute requiredRole="customer"><Profile /></RoleRoute>} />

    {/* Shared */}
    <Route path="/wallet" element={<RoleRoute><WalletPage /></RoleRoute>} />
    <Route path="/orders" element={<RoleRoute><OrdersPage /></RoleRoute>} />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

/* ===================== APP ===================== */

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <WalletProvider>
          <AppDataProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </TooltipProvider>
          </AppDataProvider>
        </WalletProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
