import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import Atendimento from "@/pages/Atendimento";
import Gerente from "@/pages/Gerente";
import Paciente from "@/pages/Paciente";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return null; // Loading is handled by ProtectedRoute
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/auth" 
        element={!session ? <Auth /> : <Navigate to="/" replace />} 
      />
      
      {/* Protected Routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/atendimento" 
        element={
          <ProtectedRoute>
            <Atendimento />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/gerente" 
        element={
          <ProtectedRoute>
            <Gerente />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/paciente" 
        element={
          <ProtectedRoute>
            <Paciente />
          </ProtectedRoute>
        } 
      />
      
      {/* Redirect to auth if not authenticated */}
      <Route 
        path="*" 
        element={!session ? <Navigate to="/auth" replace /> : <NotFound />} 
      />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;